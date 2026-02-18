/**
 * THE NATIVE DISCOVERY ENGINE
 * Fetches mail snippets directly via Cloudflare-friendly Native APIs (Gmail/Graph).
 */

export interface MailSnippet {
    id: string;
    snippet: string;
    subject?: string;
    date?: string;
}

export class MailService {
    /**
     * GMAIL NATIVE EXTRACTION
     */
    static async fetchGmailSnippets(accessToken: string): Promise<MailSnippet[]> {
        const query = encodeURIComponent("category:subscriptions OR subject:receipt OR subject:subscription OR subject:renewal");
        const url = `https://gmail.googleapis.com/gmail/v1/users/me/messages?q=${query}&maxResults=20`;

        try {
            const resp = await fetch(url, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });

            if (!resp.ok) throw new Error(`Gmail API error: ${resp.statusText}`);
            const data = await resp.json();

            if (!data.messages) return [];

            // Fetch snippets for each message
            const snippetPromises = data.messages.map(async (msg: any) => {
                const detailResp = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}?format=minimal`, {
                    headers: { Authorization: `Bearer ${accessToken}` }
                });
                const detail = await detailResp.json();
                return {
                    id: msg.id,
                    snippet: detail.snippet || "",
                };
            });

            return Promise.all(snippetPromises);
        } catch (error) {
            console.error("[MailService] Gmail Fetch Failed:", error);
            return [];
        }
    }

    /**
     * MICROSOFT GRAPH NATIVE EXTRACTION
     */
    static async fetchMicrosoftSnippets(accessToken: string): Promise<MailSnippet[]> {
        const query = encodeURIComponent("subject:receipt OR subject:subscription OR subject:renewal");
        const url = `https://graph.microsoft.com/v1.0/me/messages?$search="${query}"&$select=id,bodyPreview,subject,receivedDateTime&$top=20`;

        try {
            const resp = await fetch(url, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });

            if (!resp.ok) throw new Error(`Microsoft Graph error: ${resp.statusText}`);
            const data = await resp.json();

            return (data.value || []).map((msg: any) => ({
                id: msg.id,
                snippet: msg.bodyPreview || "",
                subject: msg.subject,
                date: msg.receivedDateTime
            }));
        } catch (error) {
            console.error("[MailService] Microsoft Fetch Failed:", error);
            return [];
        }
    }
}
