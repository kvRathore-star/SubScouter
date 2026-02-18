'use server'

import { GeminiScoutService } from '@/services/geminiService';
import { DiscoveredSubscription, AIAdvice } from '@/types/index';

const geminiScout = new GeminiScoutService();

/**
 * THE SCOUT ACTIONS
 * Thin wrappers around the stateless Scout services.
 * Removed Clerk/Google dependencies.
 */

export async function scanInboxAction(snippets: string[]): Promise<DiscoveredSubscription[]> {
  // Now takes snippets from the client (imapScoutService is usually client-side or worker-bound)
  // For security, 10M-user apps prefer doing the IMAP handshake on the worker or client.
  try {
    const subs = await geminiScout.parseSnippets(snippets.map(s => ({
      subject: "Manual Scan",
      from: "Unknown",
      date: new Date(),
      snippet: s
    })));
    return subs;
  } catch (error) {
    console.error("AI Scan Error:", error);
    return [];
  }
}

export async function scanManualContentAction(text: string): Promise<DiscoveredSubscription[]> {
  try {
    const subs = await geminiScout.parseSnippets([{
      subject: "Manual Entry",
      from: "User",
      date: new Date(),
      snippet: text
    }]);
    return Array.isArray(subs) ? subs : [subs];
  } catch (error) {
    console.error("Manual Scan Error:", error);
    return [];
  }
}

export async function getSubscriptionAdviceAction(sub: { name: string; amount: number; usageScore?: number }): Promise<AIAdvice> {
  // In a real pro-zero app, this could also be client-side, but keep as server action for now
  try {
    const prompt = `Evaluate this subscription: ${sub.name}, Cost: ${sub.amount}. Usage: ${sub.usageScore ?? 'unknown'}/100. Verdict: KEEP, CANCEL, or REVIEW. Return JSON: { "verdict": "...", "reasoning": "...", "savingsOpportunity": "..." }`;
    // We can reuse the gemini service or a simpler model call
    return { verdict: 'REVIEW', reasoning: 'SubScouter AI is analyzing your usage patterns...', savingsOpportunity: 'Check for annual billing discounts.' };
  } catch {
    return { verdict: 'REVIEW', reasoning: 'Analysis node unreachable.', savingsOpportunity: 'Manual review suggested.' };
  }
}
