import { decodeBase64 } from './base64.ts';
import { removeConsecutiveSpaces } from './textUtils.ts';

export type ApiDesignRequest = {
    // field_mask: string
    // filter: string
    /** APIs should hide soft-deleted resources by default */
    show_deleted: boolean;
    order_by: string;
    page_size: number;
    /** Token to signify implementation details may change. */
    page_token: string;
};

export type ApiDesignResponse<T> = {
    items: T[];
    page_size: number;
    page_token: string;
    next_page_token: string | null;
};

type OrderByConfig<T> = Array<keyof T>;

type DefaultOrderBy<T> = Array<{
    [K in keyof T]?: 'desc' | 'asc';
}>;

export type ApiDesignConfig<T> = {
    orderBy: OrderByConfig<T>;
    maxPageSize: number;
    defaults: {
        pageSize: number;
        orderBy?: DefaultOrderBy<T>;
    };
};

/**
 *
 * Parses URLSearchParams with defaults defined in ApiDesignConfig.
 *
 * Fields:
 * - order_by: string
 * - show_deleted: boolean
 * - page_size: number
 * - page_token: string
 * - skip: number
 * - (not supported, yet?) field_mask: string
 * - (not supported, yet?) filter: string
 */
export function parseURLSearchParams<T>(
    searchParams: URLSearchParams,
    config: ApiDesignConfig<T>
) {
    const orderBy = parseOrderBy<T>(searchParams.get('order_by'), config);
    // const skip = parseSkip(searchParams.get('skip'));

    const pagination = {
        ...parsePageToken(searchParams.get('page_token')),
        pageSize: parsePageSize(searchParams.get('page_size'), config),
    };

    return {
        pagination,
        orderBy,
        // skip,
    };
}

export type OrderBy = { field: string; direction: 'asc' | 'desc' };

// Currently only works one level deep
// TODO: allow field traversal with '.' and wildcard '*'
export function parseOrderBy<T>(
    query: string | null,
    config: ApiDesignConfig<T>
) {
    if (query === null) return config.defaults.orderBy;

    const fields = removeConsecutiveSpaces(query).split(',');
    // type coerced
    // Array<{[K in keyof T]: 'desc' | 'asc'}>
    return fields.reduce((prev: any, fieldData) => {
        const fieldArray = fieldData.trim().split(' ');
        // Known false type assertion: the fieldArray will not _always_ be type keyof T
        // This stops typescript from yelling about the narrowed type
        // https://fettblog.eu/typescript-array-includes/
        const field = fieldArray[0] as keyof T;
        if (!config.orderBy.includes(field)) {
            return prev;
        }

        const fieldValue = fieldArray[1] === 'desc' ? 'desc' : 'asc';

        return [...prev, { [field]: fieldValue }];
        // as Array<{
        //     [K in keyof T]: 'desc' | 'asc';
        // }>;

        // const parsedField = fieldArray[0]
        //     .split('.')
        //     .reduceRight(
        //         (res, key) => ({ [key]: res }),
        //         fieldArray[1] ?? 'asc'
        //     );
        // return [...prev, parsedField];
    }, []) as Array<{ [K in keyof T]: 'desc' | 'asc' }>;
    // return fieldArray.reduce((prev: Array<keyof T>, fieldData) => {
    //     if (!config.orderBy.includes(fieldData)) {
    //         return prev;
    //     }
    //     return [...prev, fieldData];
    // }, []) as Array<keyof T>;
}

/**
 * Define your own implementation of parsing page token.
 * @param string
 * @returns
 */
function parsePageToken(string: string | null): {
    pageToken: string | null;
    nextPageToken: string | null;
} {
    if (string === null) return { pageToken: null, nextPageToken: null };
    const token = decodeBase64(string);
    return { pageToken: token, nextPageToken: null };
}

// /**
//  * Define your own implementation of parsing page token.
//  * @param string
//  * @returns
//  */
// function parsePageToken(string: string | null): {
//     pageToken: number;
//     nextPageToken: number;
// } {
//     if (string === null) return { pageToken: 0, nextPageToken: 1 };
//     const token = Number(string);
//     const parsedToken = isNaN(token) ? 0 : token;
//     return { pageToken: parsedToken, nextPageToken: parsedToken + 1 };
// }

function parsePageSize<T>(string: string | null, config: ApiDesignConfig<T>) {
    if (string === null) return config.defaults.pageSize;
    const pageSize = Number(string);
    // Ensure page size is a number and
    const parsedPageSize = isNaN(pageSize)
        ? config.defaults.pageSize
        : pageSize < config.maxPageSize
        ? pageSize
        : config.maxPageSize;
    return parsedPageSize;
}

function parseSkip(string: string | null) {
    if (string === null) return 0;
    const skip = Number(string);
    return isNaN(skip) ? 0 : skip;
}
