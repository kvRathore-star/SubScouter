/**
 * THE UNIVERSAL SCOUT (IMAP Engine)
 * Connects to user inboxes to find subscription traces.
 */
export class ImapScoutService {
    async getSnippets(config: {
        host: string;
        port: number;
        secure: boolean;
        auth: { user: string; pass: string; accessToken?: string };
    }, retries = 3): Promise<MailSnippet[]> {
        // Dynamic import to bypass build-time static analysis of Node libs
        const { ImapFlow } = await import("imapflow");

        const client = new ImapFlow({
            host: config.host,
            port: config.port,
            secure: config.secure,
            auth: config.auth,
            logger: false,
        });

        const connectWithRetry = async (attempt: number): Promise<void> => {
            try {
                await client.connect();
            } catch (err) {
                if (attempt < retries) {
                    console.warn(`IMAP Connection failed (attempt ${attempt}). Retrying...`);
                    await new Promise(resolve => setTimeout(resolve, 2000 * attempt));
                    return connectWithRetry(attempt + 1);
                }
                throw err;
            }
        };

        await connectWithRetry(1);

        const lock = await client.getMailboxLock("INBOX");
        const snippets: MailSnippet[] = [];

        try {
            const date = new Date();
            date.setDate(date.getDate() - 30);

            const query = {
                since: date,
                or: [
                    { body: "invoice" },
                    { body: "renewal" },
                    { body: "order" },
                    { body: "premium" },
                    { body: "subscription" }
                ]
            };

            // Limit to 50 most recent matching messages for stability
            let count = 0;
            for await (const msg of client.fetch(query, { envelope: true, source: { start: 0, end: 1000 } })) {
                if (count >= 50) break;
                snippets.push({
                    subject: msg.envelope.subject || "",
                    from: msg.envelope.from?.[0]?.address || "",
                    date: msg.envelope.date || new Date(),
                    snippet: msg.source?.toString().substring(0, 1000) || "",
                });
                count++;
            }
        } finally {
            lock.release();
        }

        await client.logout();
        return snippets;
    }
}
