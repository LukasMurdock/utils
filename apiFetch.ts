/**
 * Fetch wrapper that adds headers for:
 * - authorization
 * - content-type of application/json
 *
 * These headers can be overridden by passing them in the init object.
 *
 * If the access_token should be unique, use apiFetchWithToken instead.
 * @see apiFetchWithToken
 */
export async function apiFetch(url: string, init?: RequestInit) {
    return await fetch(url, {
        ...init,
        headers: {
            Authorization: `Bearer ACCESS_TOKEN`,
            'Content-Type': 'application/json',
            ...init?.headers,
        },
    });
}

/**
 * If the access_token should be unique
 *
 * Fetch wrapper that adds headers for:
 * - authorization
 * - content-type of application/json
 *
 * These headers can be overridden by passing them in the init object.
 *
 * If the access_token does not have to be unique, use apiFetch instead.
 * @see apiFetch
 */
export async function apiFetchWithToken(
    token: string,
    url: string,
    init?: RequestInit
) {
    return await fetch(url, {
        ...init,
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            ...init?.headers,
        },
    });
}
