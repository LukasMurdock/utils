/**
 * Deno supports window, so check for document.
 */
export function runningInBrowser() {
    if (typeof window === 'undefined') {
        // running in a server environment
        return { browser: false, server: true };
    } else {
        // running in a browser environment
        return { browser: true, server: false };
    }
}
