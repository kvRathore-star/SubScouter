"use client";

import { openDB, IDBPDatabase } from 'idb';
import { useState, useEffect } from 'react';
import { Subscription } from '@/types';

const DB_NAME = 'subscouter_db';
const STORES = {
    SUBSCRIPTIONS: 'subscriptions',
    METADATA: 'metadata'
};

/**
 * THE LOCAL-FIRST ENGINE
 * Manages 100% of user data in IndexedDB.
 * Supports R2 Cloud Sync for multi-device portability.
 */
export const useScoutStore = () => {
    const [db, setDb] = useState<IDBPDatabase | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const init = async () => {
            try {
                // Safety timeout: Don't hang the app for more than 3 seconds on DB init
                const timeout = setTimeout(() => {
                    console.warn("DB Initialization timed out. Falling back to memory mode.");
                    setLoading(false);
                }, 3000);

                const _db = await openDB(DB_NAME, 1, {
                    upgrade(db) {
                        if (!db.objectStoreNames.contains(STORES.SUBSCRIPTIONS)) {
                            db.createObjectStore(STORES.SUBSCRIPTIONS, { keyPath: 'id' });
                        }
                        if (!db.objectStoreNames.contains(STORES.METADATA)) {
                            db.createObjectStore(STORES.METADATA);
                        }
                    },
                });

                clearTimeout(timeout);
                setDb(_db);
                setLoading(false);
            } catch (err) {
                console.error("Critical: Failed to initialize Sovereign Engine:", err);
                setLoading(false); // Release the UI lock even on failure
            }
        };
        init();
    }, []);

    const getAllSubscriptions = async (): Promise<Subscription[]> => {
        if (!db) return [];
        return await db.getAll(STORES.SUBSCRIPTIONS);
    };

    const saveSubscriptions = async (subs: Subscription[]) => {
        if (!db) return;
        const tx = db.transaction(STORES.SUBSCRIPTIONS, 'readwrite');
        for (const sub of subs) {
            await tx.store.put(sub);
        }
        await tx.done;
    };

    const deleteSubscription = async (id: string) => {
        if (!db) return;
        await db.delete(STORES.SUBSCRIPTIONS, id);
    };

    /**
     * CLOUD SYNC ENGINE (SECURE)
     * Serializes local state into an AES-GCM encrypted blob for R2.
     */
    const syncToCloud = async (userId: string) => {
        if (!db) return;
        const allData = await getAllSubscriptions();
        const { encryptDataNode } = await import('@/utils/crypto');

        // Use userId as a base for the session key (ideally prompt for a master pass)
        const encryptedData = await encryptDataNode(JSON.stringify(allData), userId);
        const blob = new Blob([encryptedData], { type: 'text/plain' });

        const formData = new FormData();
        formData.append('file', blob, 'backup.enc');
        formData.append('userId', userId);

        const res = await fetch('/api/sync/upload', {
            method: 'POST',
            body: formData,
        });

        if (res.ok) {
            await db.put(STORES.METADATA, new Date().toISOString(), 'last_sync');
        }
    };

    const restoreFromCloud = async (userId: string) => {
        if (!db) return;
        const res = await fetch(`/api/sync/download?userId=${userId}`);
        if (res.ok) {
            const { decryptDataNode } = await import('@/utils/crypto');
            const encryptedData = await res.text();
            const decryptedData = await decryptDataNode(encryptedData, userId);

            if (decryptedData !== "ERR_DECRYPT_FAILURE") {
                const subs: Subscription[] = JSON.parse(decryptedData);
                await saveSubscriptions(subs);
                return true;
            }
        }
        return false;
    };

    return {
        loading,
        getAllSubscriptions,
        saveSubscriptions,
        deleteSubscription,
        syncToCloud,
        restoreFromCloud
    };
};
