import { intervalToDuration, parseISO, formatDistance } from 'date-fns';

export function daysAgo(date: Date, daysAgo: number) {
    return date.getDate() - daysAgo;
}

export function aWeekAgo(date: Date) {
    return daysAgo(date, 7);
}

export function aMonthAgo(date: Date) {
    return daysAgo(date, 30);
}

/**
 * Sort array of objects by most recent date.
 * @param array array of objects
 * @param dateAccessor object key to access date
 */
export function latestDate(array: any, dateAccessor: string) {
    return array.sort(function (a: any, b: any) {
        return a[dateAccessor] < b[dateAccessor]
            ? -1
            : a[dateAccessor] > b[dateAccessor]
            ? 1
            : 0;
    });
}

/**
 * Give elapsed time in words since two ISO dates.
 *
 * @param startISO starting ISO date
 * @param endISO ending ISO date
 * @returns
 */
export function timeElapsed(startISO: string, endISO: string) {
    return formatDistance(parseISO(startISO), parseISO(endISO));
}
