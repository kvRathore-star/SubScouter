'use server'

import { auth, clerkClient } from '@clerk/nextjs/server';
import { google } from 'googleapis';
import { getIntegrations } from '@/actions/sheets';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { DiscoveredSubscription, AIAdvice } from '@/types/index';

const SKIP_AUTH = process.env.NEXT_PUBLIC_SKIP_AUTH === 'true';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

async function safeGenerate(prompt: string, retries = 2): Promise<string> {
  for (let i = 0; i <= retries; i++) {
    try {
      const result = await model.generateContent(prompt);
      return result.response.text().replace(/```json|```/g, '').trim();
    } catch (e: any) {
      if (i === retries) throw e;
      await new Promise(r => setTimeout(r, 1000 * (i + 1)));
    }
  }
  throw new Error('AI generation failed after retries');
}

function safeParseJSON(text: string): any {
  try {
    return JSON.parse(text);
  } catch {
    // Try to extract JSON array or object from text
    const arrayMatch = text.match(/\[[\s\S]*\]/);
    const objectMatch = text.match(/\{[\s\S]*\}/);
    if (arrayMatch) return JSON.parse(arrayMatch[0]);
    if (objectMatch) return JSON.parse(objectMatch[0]);
    throw new Error('Could not parse AI response as JSON');
  }
}

export async function scanInboxAction(): Promise<DiscoveredSubscription[]> {
  const { userId } = await auth();
  if (!userId) throw new Error('ERR_AUTH_REQ: Identification required.');

  // ═══ THE STABILITY SENTINEL: RATE LIMITING ═══
  // Zero-DB protection against API Bombing using Clerk Metadata
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const lastScan = user.publicMetadata?.lastScanDate as string;

  if (lastScan) {
    const lastDate = new Date(lastScan);
    const diffSeconds = (new Date().getTime() - lastDate.getTime()) / 1000;
    if (diffSeconds < 30) {
      throw new Error(`ERR_RATE_LIMIT: Guardian is cooling down. Please wait ${Math.ceil(30 - diffSeconds)}s before scanning again.`);
    }
  }

  if (SKIP_AUTH) {
    return [
      { name: 'Amazon Prime', amount: 14.99, currency: 'USD', billingCycle: 'monthly', category: 'Shopping', snippet: 'Your Amazon Prime membership will renew on March 1st for $14.99.', confidence: 0.95 },
      { name: 'Disney+', amount: 7.99, currency: 'USD', billingCycle: 'monthly', category: 'Entertainment', snippet: 'Invoice for your Disney+ subscription. Monthly charge: $7.99.', confidence: 0.92 },
      { name: 'Canva Pro', amount: 0, currency: 'USD', billingCycle: 'trial', category: 'Software', snippet: 'Your Canva Pro free trial has started. Trial ends Feb 28.', confidence: 0.88, isTrial: true },
    ];
  }

  if (!userId) throw new Error('ERR_SCAN_AUTH: Please sign in to scan your inbox.');

  const integrations = await getIntegrations();
  if (integrations.length === 0) return [];

  const allSnippets: string[] = [];

  // Scoped execution for each provider to ensure one failure doesn't stop the whole engine
  for (const integration of integrations) {
    try {
      console.log(`[SubScout] Intelligence gathering for node: ${integration.email} (${integration.provider})`);

      if (integration.provider === 'google') {
        const client = await clerkClient();
        const oauthResponse = await client.users.getUserOauthAccessToken(userId, 'oauth_google');
        const token = oauthResponse.data[0]?.token;

        if (token) {
          const authClient = new google.auth.OAuth2();
          authClient.setCredentials({ access_token: token });
          const gmail = google.gmail({ version: 'v1', auth: authClient });
          const q = 'subject:(subscription OR billing OR invoice OR receipt OR "order confirmation")';
          const listResponse = await gmail.users.messages.list({
            userId: 'me',
            q,
            maxResults: 10,
            fields: 'messages(id,threadId)'
          });

          if (listResponse.data.messages) {
            for (const msg of listResponse.data.messages) {
              // Extraction focal point: format=minimal for snippet-only retrieval
              const message = await gmail.users.messages.get({
                userId: 'me',
                id: msg.id!,
                format: 'minimal',
                fields: 'snippet,payload/headers'
              });

              const subject = message.data.payload?.headers?.find(h => h.name === 'Subject')?.value || '';
              allSnippets.push(`[SOURCE:GMAIL][${integration.email}] SUBJ: ${subject} | SNIP: ${message.data.snippet || ''}`);
            }
          }
        }
      } else if (integration.provider === 'imap' || integration.provider === 'apple') {
        // Universal IMAP Extraction Engine (Apple, GMX, custom IMAP)
        const config = integration.imapConfig;
        if (config && config.password) {
          try {
            const { connect } = await import('imap-simple');
            const { simpleParser } = await import('mailparser');

            const imapConfig = {
              imap: {
                user: config.user,
                password: config.password,
                host: config.host || (integration.provider === 'apple' ? 'imap.mail.me.com' : ''),
                port: config.port || 993,
                tls: config.tls !== false,
                authTimeout: 5000
              }
            };

            const connection = await connect(imapConfig);
            await connection.openBox('INBOX');

            // Search for financial signals in the last 30 days
            const delay = 30 * 24 * 3600 * 1000;
            const yesterday = new Date();
            yesterday.setTime(Date.now() - delay);
            const searchCriteria = [
              ['OR', ['OR', ['SUBJECT', 'invoice'], ['SUBJECT', 'receipt']], ['OR', ['SUBJECT', 'subscription'], ['SUBJECT', 'order']]],
              ['SINCE', yesterday.toISOString()]
            ];
            const fetchOptions = { bodies: ['HEADER', 'TEXT'], struct: true };

            const messages = await connection.search(searchCriteria, fetchOptions);

            for (const msg of messages.slice(0, 10)) {
              const all = msg.parts.find(p => p.which === 'TEXT');
              const header = msg.parts.find(p => p.which === 'HEADER');

              if (all) {
                const mail = await simpleParser(all.body);
                const subject = (header?.body?.subject?.[0]) || mail.subject || 'No Subject';
                allSnippets.push(`[SOURCE:IMAP][${integration.email}] SUBJ: ${subject} | SNIP: ${mail.text?.substring(0, 200) || ''}`);
              }
            }

            connection.end();
          } catch (e) {
            console.error(`[SubScout] IMAP sync failure for ${integration.email}:`, e);
          }
        }
      } else if (integration.provider === 'outlook') {
        const client = await clerkClient();
        const oauthResponse = await client.users.getUserOauthAccessToken(userId, 'oauth_microsoft');
        const token = oauthResponse.data[0]?.token;

        if (token) {
          try {
            // Extraction focal point: use OData filters to target financial communications
            const query = "$filter=contains(subject, 'invoice') or contains(subject, 'receipt') or contains(subject, 'subscription') or contains(subject, 'order') or contains(subject, 'billing')";
            const response = await fetch(`https://graph.microsoft.com/v1.0/me/messages?${query}&$top=15&$select=subject,bodyPreview`, {
              headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
              const data = await response.json();
              for (const msg of data.value || []) {
                allSnippets.push(`[SOURCE:OUTLOOK][${integration.email}] SUBJ: ${msg.subject} | SNIP: ${msg.bodyPreview || ''}`);
              }
            } else {
              console.warn(`[SubScout] MS Graph API error (${response.status}) for ${integration.email}`);
            }
          } catch (e) {
            console.error(`[SubScout] MS Graph sync failure for ${integration.email}:`, e);
          }
        }
      }
    } catch (e: any) {
      console.error(`[SubScout] Intelligence failure on node ${integration.email}:`, e.message || e);
    }
  }

  if (allSnippets.length === 0) {
    console.log("[SubScout] No subscription signals detected in current search space.");
    return [];
  }

  const prompt = `You are an elite Enterprise Subscription Intelligence Agent. Analyze these communication snippets and synthesize identified recurring subscriptions, SaaS platforms, or trial signups.

Snippets DATA: ${JSON.stringify(allSnippets)}

EXTRACTION PROTOCOL:
1. Extract canonical service name (e.g., "Microsoft 365" instead of "MS 365").
2. Extract exact Amount (number only) and ISO Currency code.
3. Classify into enterprise categories: [Software, Entertainment, Music, Productivity, Shopping, Utilities, Business, Health, Education, Finance, Other].
4. Identify billingCycle: "monthly", "yearly", "manual", or "trial".
5. Extract definitive nextBillingDate (YYYY-MM-DD). If ambiguous, use current relative date context (Today is ${new Date().toISOString().split('T')[0]}).
6. Extract Primary Domain (e.g., adobe.com) for vector asset retrieval.
7. Synthesize a professional 1-sentence finding report.
8. Calibrate Confidence Score (0.00-1.00).

STRICT OUTPUT FORMAT:
Return ONLY a valid JSON array. No markdown, no preamble. 
Schema: Array<{ name: string, amount: number, currency: string, billingCycle: string, nextBillingDate: string, domain: string, category: string, snippet: string, confidence: number, isTrial: boolean }>`;

  const text = await safeGenerate(prompt);
  const rawData = safeParseJSON(text);

  const subscriptions = (Array.isArray(rawData) ? rawData : [rawData]).map((d: any) => {
    const confidence = typeof d.confidence === 'number' ? d.confidence : parseFloat(d.confidence) || 0.8;
    const isLowConfidence = confidence < 0.7;

    return {
      ...d,
      amount: typeof d.amount === 'number' ? d.amount : parseFloat(d.amount) || 0,
      confidence,
      isTrial: d.isTrial || d.billingCycle === 'trial',
      category: d.category || 'Other',
      snippet: isLowConfidence ? `⚠️ [PENDING REVIEW] ${d.snippet}` : d.snippet,
      nextBillingDate: d.nextBillingDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      logoUrl: d.domain ? `https://logo.clearbit.com/${d.domain}` : undefined
    };
  });

  // ═══ ZERO-DB STATE SYNC ═══
  // Persist scan timestamp to Clerk to eliminate internal user tables
  try {
    const clerk = await clerkClient();
    await clerk.users.updateUserMetadata(userId, {
      publicMetadata: {
        lastScanDate: new Date().toISOString()
      }
    });
    console.log(`[SubScout] Syncing scan state to Identity Layer for ${userId}`);
  } catch (e) {
    console.error("[SubScout] State sync failure:", e);
  }

  return subscriptions;
}

export async function scanManualContentAction(text: string): Promise<DiscoveredSubscription[]> {
  const prompt = `You are a subscription detection AI. Extract subscription or trial details from this content:

Content: ${text}

Return ONLY a JSON array of found subscriptions: [{ "name": "...", "amount": 0, "currency": "USD", "billingCycle": "monthly", "category": "...", "snippet": "...", "confidence": 0.9, "isTrial": false }]`;

  const resText = await safeGenerate(prompt);
  const parsed = safeParseJSON(resText);
  return Array.isArray(parsed) ? parsed : [parsed];
}

export async function getCancellationStepsAction(serviceName: string) {
  const prompt = `Provide 4-5 concise, step-by-step instructions for cancelling a ${serviceName} subscription. Be specific with navigation paths. Return JSON: { "steps": ["Step 1...", "Step 2..."] }`;

  const text = await safeGenerate(prompt);
  return safeParseJSON(text);
}

export async function getSubscriptionAdviceAction(sub: { name: string; amount: number; usageScore?: number }): Promise<AIAdvice> {
  const prompt = `You are a financial advisor AI. Evaluate this subscription:
- Name: ${sub.name}
- Monthly cost: $${sub.amount}
- Usage score: ${sub.usageScore ?? 'unknown'}/100

Provide a verdict: KEEP (high value), CANCEL (low value/unused), or REVIEW (worth investigating).
Return JSON: { "verdict": "KEEP|CANCEL|REVIEW", "reasoning": "1-2 sentences", "savingsOpportunity": "1 sentence" }`;

  try {
    const text = await safeGenerate(prompt);
    return safeParseJSON(text);
  } catch {
    return { verdict: 'REVIEW', reasoning: 'Unable to analyze at this time. Please check manually.', savingsOpportunity: 'Review usage patterns.' };
  }
}
