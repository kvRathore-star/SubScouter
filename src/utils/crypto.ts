/**
 * THE SOVEREIGN CRYPTO ENGINE
 * Implements 100% client-side AES-GCM encryption for cloud sync.
 * Neither Cloudflare nor the developer can read user data.
 */

const ALGO = "AES-GCM";

async function getKey(password: string) {
    const enc = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
        "raw",
        enc.encode(password),
        { name: "PBKDF2" },
        false,
        ["deriveKey"]
    );
    return crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt: enc.encode("subscouter-salt-ultra-prime"),
            iterations: 100000,
            hash: "SHA-256",
        },
        keyMaterial,
        { name: ALGO, length: 256 },
        false,
        ["encrypt", "decrypt"]
    );
}

export async function encryptDataNode(data: string, secret: string): Promise<string> {
    const enc = new TextEncoder();
    const key = await getKey(secret);
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await crypto.subtle.encrypt(
        { name: ALGO, iv },
        key,
        enc.encode(data)
    );

    const result = new Uint8Array(iv.length + encrypted.byteLength);
    result.set(iv);
    result.set(new Uint8Array(encrypted), iv.length);

    return btoa(String.fromCharCode(...result));
}

export async function decryptDataNode(encryptedB64: string, secret: string): Promise<string> {
    try {
        const key = await getKey(secret);
        const data = Uint8Array.from(atob(encryptedB64), (c) => c.charCodeAt(0));
        const iv = data.slice(0, 12);
        const ciphertext = data.slice(12);

        const decrypted = await crypto.subtle.decrypt(
            { name: ALGO, iv },
            key,
            ciphertext
        );

        return new TextDecoder().decode(decrypted);
    } catch (err) {
        console.error("Decryption failed:", err);
        return "ERR_DECRYPT_FAILURE";
    }
}
