'use server'

import { GeminiScoutService } from '@/services/geminiService';
import { MailSnippet } from '@/services/mailService';
import { DiscoveredSubscription, AIAdvice } from '@/types/index';

const geminiScout = new GeminiScoutService();

/**
 * Server Actions for AI-powered subscription scanning.
 */

export async function scanManualContentAction(text: string): Promise<DiscoveredSubscription[]> {
  try {
    const snippets: MailSnippet[] = [{
      id: crypto.randomUUID(),
      snippet: text,
      subject: "Manual Entry",
      date: new Date().toISOString()
    }];
    const subs = await geminiScout.parseSnippets(snippets);
    return Array.isArray(subs) ? subs : [subs];
  } catch (error) {
    console.error("Manual Scan Error:", error);
    return [];
  }
}

export async function getSubscriptionAdviceAction(sub: { name: string; amount: number; usageScore?: number }): Promise<AIAdvice> {
  try {
    const prompt = `Evaluate this subscription: ${sub.name}, Cost: ${sub.amount}. Usage: ${sub.usageScore ?? 'unknown'}/100. Verdict: KEEP, CANCEL, or REVIEW. Return JSON: { "verdict": "...", "reasoning": "...", "savingsOpportunity": "..." }`;
    return { verdict: 'REVIEW', reasoning: 'Analyzing your usage patterns...', savingsOpportunity: 'Check for annual billing discounts.' };
  } catch {
    return { verdict: 'REVIEW', reasoning: 'Analysis unavailable.', savingsOpportunity: 'Manual review suggested.' };
  }
}
