import { Subscription } from "../types";

export interface AgentNegotiationResponse {
    script: string;
    probabilityOfSuccess: number;
    nextStep: string;
}

export interface AgentHaltResponse {
    sequence: string[];
    automationPossible: boolean;
    reasoning: string;
}

export const agentService = {
    negotiate: async (sub: Subscription, userId: string): Promise<AgentNegotiationResponse> => {
        const response = await fetch('/api/agent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, action: 'negotiate', payload: sub })
        });
        if (!response.ok) throw new Error('Agent negotiation failed');
        return response.json();
    },

    halt: async (sub: Subscription, userId: string): Promise<AgentHaltResponse> => {
        const response = await fetch('/api/agent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, action: 'halt', payload: sub })
        });
        if (!response.ok) throw new Error('Agent halt sequence failed');
        return response.json();
    }
};
