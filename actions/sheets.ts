'use server'

import { auth, clerkClient } from '@clerk/nextjs/server';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { google } from 'googleapis';
import { Subscription, LinkedEmail } from '@/types/index';

const SKIP_AUTH = process.env.NEXT_PUBLIC_SKIP_AUTH === 'true';

const MOCK_SUBS: Subscription[] = [
    {
        id: '1', name: 'Netflix', amount: 15.99, currency: 'USD', billingCycle: 'monthly',
        category: 'Entertainment', nextBillingDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'active', usageScore: 85, logoUrl: 'https://logo.clearbit.com/netflix.com'
    },
    {
        id: '2', name: 'Spotify', amount: 9.99, currency: 'USD', billingCycle: 'monthly',
        category: 'Entertainment', nextBillingDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'active', usageScore: 92, logoUrl: 'https://logo.clearbit.com/spotify.com'
    },
    {
        id: '3', name: 'Adobe Creative Cloud', amount: 52.99, currency: 'USD', billingCycle: 'monthly',
        category: 'Software', nextBillingDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'active', usageScore: 15, logoUrl: 'https://logo.clearbit.com/adobe.com'
    },
    {
        id: '4', name: 'Dropbox', amount: 119.88, currency: 'USD', billingCycle: 'yearly',
        category: 'Software', nextBillingDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'active', usageScore: 40, logoUrl: 'https://logo.clearbit.com/dropbox.com'
    },
    {
        id: '5', name: 'New York Times', amount: 4.00, currency: 'USD', billingCycle: 'monthly',
        category: 'News', nextBillingDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'active', usageScore: 50, logoUrl: 'https://logo.clearbit.com/nytimes.com'
    }
];

const HEADERS = ['ID', 'Name', 'Amount', 'Currency', 'Billing Cycle', 'Category', 'Next Billing Date', 'Status', 'Usage Score', 'Last Used Date', 'Logo URL', 'Start Date', 'Canceled Date', 'Is Trial', 'Confidence', 'Action_Requested', 'Last_Action_Status'];
const TRANSACTION_HEADERS = ['ID', 'SubscriptionID', 'Name', 'Date', 'Amount', 'Currency', 'Status'];

export interface Transaction {
    id: string;
    subscriptionId: string;
    name: string;
    date: string;
    amount: number;
    currency: string;
    status: 'paid' | 'pending' | 'failed';
}

/**
 * Centralized authentication and spreadsheet identification.
 * Improved error reporting for enterprise-grade reliability.
 */
async function getAuthContext() {
    const { userId } = await auth();
    if (!userId) throw new Error('ERR_AUTH_REQUIRED: Please sign in to continue.');

    const client = await clerkClient();
    let oauthResponse;
    try {
        oauthResponse = await client.users.getUserOauthAccessToken(userId, 'oauth_google');
    } catch (e) {
        console.error("[SubScout] Clerk OAuth fetch failed:", e);
        throw new Error('ERR_OAUTH_FETCH: Could not retrieve Google credentials.');
    }

    const token = oauthResponse.data[0]?.token;
    if (!token) throw new Error('ERR_TOKEN_MISSING: Google connection required. Please reconnect in Settings.');

    const authClient = new google.auth.OAuth2();
    authClient.setCredentials({ access_token: token });

    const clerkUser = await client.users.getUser(userId);
    let spreadsheetId = clerkUser.publicMetadata.spreadsheetId as string;

    if (!spreadsheetId) {
        console.log("[SubScout] Initializing new storage grid for user:", userId);
        try {
            const sheets = google.sheets({ version: 'v4', auth: authClient });
            const spreadsheet = await sheets.spreadsheets.create({
                requestBody: { properties: { title: 'SubScout — Subscription Tracker' } },
                fields: 'spreadsheetId',
            });
            spreadsheetId = spreadsheet.data.spreadsheetId!;
            await client.users.updateUserMetadata(userId, { publicMetadata: { spreadsheetId } });

            // Initialize with headers
            const doc = new GoogleSpreadsheet(spreadsheetId, authClient);
            await doc.loadInfo();
            const sheet = doc.sheetsByIndex[0];
            await sheet.setHeaderRow(HEADERS);
        } catch (e) {
            console.error("[SubScout] Spreadsheet creation failed:", e);
            throw new Error('ERR_GRID_INIT: Failed to initialize subscription storage.');
        }
    }

    return { authClient, spreadsheetId };
}

/**
 * Universal wrapper for Google Spreadsheet operations to ensure
 * consistent error handling and session management.
 */
async function withDoc<T>(fn: (doc: GoogleSpreadsheet) => Promise<T>): Promise<T> {
    const { authClient, spreadsheetId } = await getAuthContext();
    const doc = new GoogleSpreadsheet(spreadsheetId, authClient);
    try {
        await doc.loadInfo();
        return await fn(doc);
    } catch (e: any) {
        console.error("[SubScout] Infrastructure Error:", e.message || e);
        throw e;
    }
}

export async function getTransactions(): Promise<Transaction[]> {
    if (SKIP_AUTH) return [
        { id: '1', subscriptionId: '1', name: 'Netflix', date: '2026-02-01', amount: 15.99, currency: 'USD', status: 'paid' },
        { id: '2', subscriptionId: '2', name: 'Spotify', date: '2026-02-01', amount: 9.99, currency: 'USD', status: 'paid' },
        { id: '3', subscriptionId: '3', name: 'Adobe', date: '2026-01-28', amount: 52.99, currency: 'USD', status: 'paid' },
        { id: '4', subscriptionId: '4', name: 'Dropbox', date: '2025-11-15', amount: 119.88, currency: 'USD', status: 'paid' },
        { id: '5', subscriptionId: '5', name: 'NYT', date: '2026-01-15', amount: 4.00, currency: 'USD', status: 'paid' },
        { id: '6', subscriptionId: '1', name: 'Netflix', date: '2026-01-01', amount: 15.99, currency: 'USD', status: 'paid' },
    ];

    try {
        return await withDoc(async (doc) => {
            let sheet = doc.sheetsByTitle['Transactions'];
            if (!sheet) return [];

            const rows = await sheet.getRows();
            return rows.map(row => ({
                id: row.get('ID'),
                subscriptionId: row.get('SubscriptionID'),
                name: row.get('Name'),
                date: row.get('Date'),
                amount: parseFloat(row.get('Amount')) || 0,
                currency: row.get('Currency') || 'USD',
                status: row.get('Status') as any,
            }));
        });
    } catch (e: any) {
        return [];
    }
}

export async function addTransaction(tx: Transaction) {
    if (SKIP_AUTH) return;

    try {
        await withDoc(async (doc) => {
            let sheet = doc.sheetsByTitle['Transactions'];
            if (!sheet) {
                sheet = await doc.addSheet({ title: 'Transactions', headerValues: TRANSACTION_HEADERS });
            }
            await sheet.addRow([tx.id, tx.subscriptionId, tx.name, tx.date, tx.amount, tx.currency, tx.status]);
        });
    } catch (e: any) {
        // Log handled in withDoc
    }
}

export async function getSubscriptions(): Promise<Subscription[]> {
    if (SKIP_AUTH) return MOCK_SUBS;

    try {
        return await withDoc(async (doc) => {
            const sheet = doc.sheetsByIndex[0];
            const rows = await sheet.getRows();

            return rows.map(row => ({
                id: row.get('ID'),
                name: row.get('Name'),
                amount: parseFloat(row.get('Amount')) || 0,
                currency: row.get('Currency') || 'USD',
                billingCycle: row.get('Billing Cycle') as any,
                category: row.get('Category') || 'Other',
                nextBillingDate: row.get('Next Billing Date'),
                status: row.get('Status') as any,
                usageScore: row.get('Usage Score') ? parseInt(row.get('Usage Score')) : undefined,
                lastUsedDate: row.get('Last Used Date') || undefined,
                logoUrl: row.get('Logo URL') || undefined,
                startDate: row.get('Start Date') || undefined,
                canceledDate: row.get('Canceled Date') || undefined,
                isTrial: row.get('Is Trial') === 'true',
                confidence: row.get('Confidence') ? parseFloat(row.get('Confidence')) : undefined,
                actionRequested: row.get('Action_Requested') as any,
                lastActionStatus: row.get('Last_Action_Status') as any,
            }));
        });
    } catch (e: any) {
        throw new Error("ERR_FETCH_SUBS: Couldn't load subscriptions. Please try again.");
    }
}

export async function saveSubscriptions(subs: Subscription[]) {
    if (SKIP_AUTH) return;

    try {
        const { authClient, spreadsheetId } = await getAuthContext();
        const sheets = google.sheets({ version: 'v4', auth: authClient });

        // High-Performance Batch Update: Replace sheet content in one atomic operation
        // This follows the "Zero-DB" principle of using IaaS as a high-performance engine
        const values = [
            HEADERS,
            ...subs.map(s => [
                s.id || '', s.name || '', s.amount || 0, s.currency || 'USD', s.billingCycle || '', s.category || '',
                s.nextBillingDate || '', s.status || '', s.usageScore || '', s.lastUsedDate || '',
                s.logoUrl || '', s.startDate || '', s.canceledDate || '',
                s.isTrial ? 'true' : 'false', s.confidence || '',
                s.actionRequested || '', s.lastActionStatus || ''
            ])
        ];

        await sheets.spreadsheets.values.update({
            spreadsheetId,
            range: 'Sheet1!A1',
            valueInputOption: 'USER_ENTERED',
            requestBody: { values }
        });

        console.log(`[SubScout] Persistence Vault updated: ${subs.length} records pushed.`);
    } catch (e: any) {
        console.error("[SubScout] Persistence failure:", e.message || e);
        throw new Error("ERR_SAVE_SUBS: Couldn't sync changes to the Vault. Please try again.");
    }
}

export async function getIntegrations(): Promise<LinkedEmail[]> {
    if (SKIP_AUTH) return [
        { id: '1', email: 'user@gmail.com', provider: 'google', lastScanned: '2026-02-10', status: 'active' },
        { id: '2', email: 'user@outlook.com', provider: 'outlook', lastScanned: 'Never', status: 'active' }
    ];

    try {
        return await withDoc(async (doc) => {
            let sheet = doc.sheetsByTitle['Integrations'];
            if (!sheet) return [];

            const rows = await sheet.getRows();
            return rows.map(row => ({
                id: row.get('ID'),
                email: row.get('Email'),
                provider: row.get('Provider') as any,
                lastScanned: row.get('Last Scanned'),
                accessToken: row.get('Access Token'),
                refreshToken: row.get('Refresh Token'),
                expiresAt: parseInt(row.get('Expires At') || '0'),
                status: row.get('Status') as any,
                lastMessageId: row.get('Last_Message_ID'),
                imapConfig: row.get('IMAP_Host') ? {
                    host: row.get('IMAP_Host'),
                    port: parseInt(row.get('IMAP_Port')) || 993,
                    tls: row.get('IMAP_TLS') === 'true',
                    user: row.get('IMAP_User') || row.get('Email'),
                    password: row.get('IMAP_Pass') // Note: In a real prod env, we'd encrypt this
                } : undefined
            }));
        });
    } catch (e: any) {
        return [];
    }
}

const INTEGRATION_HEADERS = ['ID', 'Email', 'Provider', 'Last Scanned', 'Access Token', 'Refresh Token', 'Expires At', 'Status', 'Last_Message_ID', 'IMAP_Host', 'IMAP_Port', 'IMAP_TLS', 'IMAP_User', 'IMAP_Pass'];

export async function saveIntegration(integration: LinkedEmail) {
    if (SKIP_AUTH) return;

    try {
        await withDoc(async (doc) => {
            let sheet = doc.sheetsByTitle['Integrations'];
            if (!sheet) {
                sheet = await doc.addSheet({ title: 'Integrations', headerValues: INTEGRATION_HEADERS });
            }

            const rows = await sheet.getRows();
            const existing = rows.find(r => r.get('ID') === integration.id);

            const rowData = {
                ID: integration.id,
                Email: integration.email,
                Provider: integration.provider,
                'Last Scanned': integration.lastScanned,
                'Access Token': integration.accessToken || '',
                'Refresh Token': integration.refreshToken || '',
                'Expires At': integration.expiresAt ? integration.expiresAt.toString() : '',
                Status: integration.status,
                Last_Message_ID: integration.lastMessageId || '',
                IMAP_Host: integration.imapConfig?.host || '',
                IMAP_Port: integration.imapConfig?.port?.toString() || '',
                IMAP_TLS: integration.imapConfig?.tls ? 'true' : 'false',
                IMAP_User: integration.imapConfig?.user || '',
                IMAP_Pass: integration.imapConfig?.password || ''
            };

            if (existing) {
                existing.assign(rowData);
                await existing.save();
            } else {
                await sheet.addRow(Object.values(rowData));
            }
        });
    } catch (e: any) {
        // Handled in withDoc
    }
}

/**
 * THE DATA KILL-SWITCH ("Destroy Vault")
 * Revokes Google OAuth tokens and deletes the user's spreadsheet.
 * This "Brutal" honesty wins users and ensures absolute data sovereignty.
 */
export async function destroyVaultAction() {
    const { userId } = await auth();
    if (!userId) throw new Error('ERR_AUTH_REQUIRED: Authentication required for destruction.');

    const { authClient, spreadsheetId } = await getAuthContext();
    const client = await clerkClient();

    console.warn(`[SubScout] INITIATING DATA DESTRUCTION for user: ${userId}`);

    try {
        // 1. Delete the Spreadsheet via Drive API
        const drive = google.drive({ version: 'v3', auth: authClient });
        await drive.files.delete({ fileId: spreadsheetId });

        // 2. Revoke Clerk OAuth External Account (Force re-consent)
        const user = await client.users.getUser(userId);
        const googleAccount = user.externalAccounts.find((a: any) => a.provider === 'google');
        if (googleAccount) {
            await client.users.deleteUserExternalAccount({ userId, externalAccountId: googleAccount.id });
        }

        // 3. Clear Clerk Public Metadata
        await client.users.updateUserMetadata(userId, {
            publicMetadata: { spreadsheetId: null, plan: 'free' }
        });

        return { success: true };
    } catch (e: any) {
        console.error("[SubScout] Destruction failure:", e.message || e);
        throw new Error(`ERR_DESTRUCTION_FAILED: Could not fully sanitize nodes. ${e.message}`);
    }
}
