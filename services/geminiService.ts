
import { Subscription, AIAdvice, DiscoveredSubscription } from "../types";

const callScoutNode = async (action: string, payload: any, userId?: string) => {
  const response = await fetch('/api/scout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, payload, userId })
  });
  if (!response.ok) throw new Error('AI Node failure');
  return response.json();
};

export const getSubscriptionAdvice = async (sub: Subscription, userId?: string): Promise<AIAdvice> => {
  try {
    return await callScoutNode('getAdvice', sub, userId);
  } catch (error) {
    console.error("Gemini Error:", error);
    return {
      verdict: "REVIEW",
      reasoning: "Intelligence node currently busy. Manual audit recommended.",
      savingsOpportunity: "Check for bundle offers."
    };
  }
};

export const getCancellationSteps = async (serviceName: string, userId?: string): Promise<string[]> => {
  try {
    const data = await callScoutNode('getCancellation', { serviceName }, userId);
    return data.steps || [];
  } catch (error) {
    return ["Log in to the official website.", "Navigate to Account Settings.", "Select 'Manage Subscription'.", "Follow the 'Cancel' prompts."];
  }
};

export const scanBillContent = async (text: string, userId?: string): Promise<Partial<Subscription>> => {
  try {
    return await callScoutNode('scanManualContent', { text }, userId);
  } catch (error) {
    console.error("Manual Scan Error:", error);
    return {};
  }
};

export const scanInbox = async (emailSnippets: string[], userId?: string): Promise<DiscoveredSubscription[]> => {
  try {
    return await callScoutNode('scanInbox', { snippets: emailSnippets }, userId);
  } catch (error) {
    console.error("Inbox Scan Error:", error);
    return [];
  }
};
