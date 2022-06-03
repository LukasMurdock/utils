/**
 * Use by destructuring the returned object, e.g., `...optionalField(field)`
 * @param field
 * @returns
 */
export function optionalField(field: any) {
    return { ...(field && { field }) };
}
