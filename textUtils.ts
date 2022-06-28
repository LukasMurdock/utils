export function removeSpaces(string: string) {
    return string.replace(' ', '');
}

export function removeConsecutiveSpaces(string: string) {
    return string.split(/\s+/).join(' ');
}

export function capitalizeFirstLetter(text: string) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * - Test Me -> testMe
 * - Example -> example
 * - Test me  Example -> testMeExample
 */
export function sluggifyText(text: string) {
    const split = text.toLowerCase().split(' ');
    const [firstWord, ...rest] = split;
    return firstWord + rest.map(capitalizeFirstLetter).join('');
}
