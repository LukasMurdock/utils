/**
 * Buffer to hex string:
 * - convert buffer to byte array
 * - convert bytes to hex string
 * @see https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest#converting_a_digest_to_a_hex_string
 */
export function bufferToHex(buffer: ArrayBuffer) {
    return Array.from(new Uint8Array(buffer))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
}

/**
 * Uses Web Crypto API to create a SHA256 HMAC hex string.
 */
export async function simpleHmac({ key, data }: { key: string; data: string }) {
    const encoder = new TextEncoder();
    const encodedKey = encoder.encode(key);
    const encodedData = encoder.encode(data);
    /**
     * @see https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/importKey
     */
    const hmacKey = await window.crypto.subtle.importKey(
        'raw',
        encodedKey,
        {
            name: 'HMAC',
            hash: 'SHA-256',
        },
        true,
        ['sign', 'verify']
    );
    /**
     * @see https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/sign#hmac_2
     */
    const signature = await window.crypto.subtle.sign(
        'HMAC',
        hmacKey,
        encodedData
    );
    //   base64
    //   const buf1 = Buffer.from(signature).toString('base64')
    //   const buf2 = window.btoa(String.fromCharCode(...new Uint8Array(signature)))

    const hex = bufferToHex(signature);
    console.log({ hex });

    return { hex };
}
