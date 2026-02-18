'use client';

/**
 * THE PRIVACY DOUBLE-LOCK (PRODUCTION GRADE)
 * Uses Web Crypto API (AES-GCM) for 100% client-side data sovereignty.
 * The server never sees the plaintext or the key.
 */

async function getEncryptionKey(password: string, salt: Uint8Array) {
    const enc = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
        "raw",
        enc.encode(password),
        "PBKDF2",
        false,
        ["deriveKey"]
    );
    return await crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt,
            iterations: 100000,
            hash: "SHA-256",
        },
        keyMaterial,
        { name: "AES-GCM", length: 256 },
        false,
        ["encrypt", "decrypt"]
    );
}

export async function encryptDataNode(data: string, sessionKey: string): Promise<string> {
    if (!data || !sessionKey) return data;
    const enc = new TextEncoder();
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const key = await getEncryptionKey(sessionKey, salt);

    const encrypted = await crypto.subtle.encrypt(
        { name: "AES-GCM", iv },
        key,
        enc.encode(data)
    );

    const buffer = new Uint8Array(salt.byteLength + iv.byteLength + encrypted.byteLength);
    buffer.set(salt, 0);
    buffer.set(iv, salt.byteLength);
    buffer.set(new Uint8Array(encrypted), salt.byteLength + iv.byteLength);

    return btoa(String.fromCharCode(...Array.from(buffer)));
}

export async function decryptDataNode(cipher: string, sessionKey: string): Promise<string> {
    if (!cipher || !sessionKey) return cipher;
    try {
        const buffer = new Uint8Array(atob(cipher).split('').map(c => c.charCodeAt(0)));
        const salt = buffer.slice(0, 16);
        const iv = buffer.slice(16, 28);
        const data = buffer.slice(28);

        const key = await getEncryptionKey(sessionKey, salt);
        const decrypted = await crypto.subtle.decrypt(
            { name: "AES-GCM", iv },
            key,
            data
        );

        return new TextDecoder().decode(decrypted);
    } catch (e) {
        console.error("Decryption Failure:", e);
        return "ERR_DECRYPT_FAILURE";
    }
}
