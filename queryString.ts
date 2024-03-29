import { NestedPaths } from './nestedObjectPaths.ts';
import { decodeBase64 } from './base64.ts';
import { removeConsecutiveSpaces } from './textUtils.ts';

type GenericObject = Record<string, unknown>;

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

type OrderByDefaultConfig<T extends GenericObject> = {
    field: NestedPaths<T>;
    direction: 'desc' | 'asc';
}[];

type OrderByConfig<T extends GenericObject> = NestedPaths<T>[];

export type ApiDesignConfig<T extends GenericObject> = {
    orderBy: OrderByConfig<T>;
    maxPageSize: number;
    defaults: {
        orderBy: OrderByDefaultConfig<T>;
        pageSize: number;
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
export function parseURLSearchParams<T extends GenericObject>(
    searchParams: URLSearchParams,
    config: ApiDesignConfig<T>
) {
    const orderBy = parseOrderBy<T>(searchParams.get('order_by'), config);
    // const skip = parseSkip(searchParams.get('skip'));

    const pagination = {
        ...parsePageToken(searchParams.get('page_token')),
        pageSize: parsePageSize<T>(searchParams.get('page_size'), config),
    };

    return {
        pagination,
        orderBy,
        // skip,
    };
}

export type OrderBy = { field: string; direction: 'asc' | 'desc' };

// TODO: allow field traversal with wildcard '*'
export function parseOrderBy<T extends GenericObject>(
    query: string | null,
    config: ApiDesignConfig<T>
) {
    if (query === null) return config.defaults.orderBy;
    const fields = removeConsecutiveSpaces(query).split(',');
    return fields.reduce((prev: any, fieldData) => {
        const fieldArray = fieldData.trim().split(' ');
        const searchedField = fieldArray[0];
        // Ignoring typescript because
        // “Type instantiation is excessively deep and possibly infinite.”
        // @ts-ignore-next-line
        if (!config.orderBy.includes(searchedField)) {
            return prev;
        }
        const parsedField = searchedField
            .split('.')
            .reduceRight((res: any, key: any) => {
                return { [key]: res };
            }, fieldArray[1] ?? 'asc');
        return [...prev, parsedField];
    }, []);
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

function parsePageSize<T extends GenericObject>(
    string: string | null,
    config: ApiDesignConfig<T>
) {
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
