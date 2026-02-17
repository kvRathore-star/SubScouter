'use client';

/**
 * THE PRIVACY DOUBLE-LOCK
 * Simple client-side masking utility for sensitive data nodes.
 * In a Zero-DB architecture, the client's session key is the root of trust.
 * NOTE: For production, swap this with Web Crypto API (AES-GCM).
 */
export function encryptDataNode(data: string, sessionKey: string): string {
    if (!data || !sessionKey) return data;
    // Simple XOR-based masking for architectural demonstration
    const encoded = data.split('').map((char, i) =>
        String.fromCharCode(char.charCodeAt(0) ^ sessionKey.charCodeAt(i % sessionKey.length))
    ).join('');
    return btoa(encoded);
}

export function decryptDataNode(cipher: string, sessionKey: string): string {
    if (!cipher || !sessionKey) return cipher;
    try {
        const decoded = atob(cipher);
        return decoded.split('').map((char, i) =>
            String.fromCharCode(char.charCodeAt(0) ^ sessionKey.charCodeAt(i % sessionKey.length))
        ).join('');
    } catch (e) {
        return "ERR_DECRYPT_FAILURE";
    }
}
