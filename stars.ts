/**
 * @param number 1-5
 * @returns a string of stars
 */
export function getStars(number: number) {
    return `★★★★★☆☆☆☆☆`.slice(5 - number, 10 - number);
}
