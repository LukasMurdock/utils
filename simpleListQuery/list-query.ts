import { decodeBase64 } from '../base64.ts';
import { removeConsecutiveSpaces } from '../textUtils.ts';
import { KeyVal, NestedKeys } from '../utilityTypes.ts';

// https://dev.to/pffigueiredo/typescript-utility-keyof-nested-object-2pa3

export type ListQueryRequest = {
    filter?: string;
    /**
     * Fields to include in request.
     * Changing default field mask is a breaking change.
     */
    field_mask?: string;
    order_by?: string;
    /** APIs should hide soft-deleted resources by default */
    show_deleted?: boolean;
    page_size?: number;
    /** Token, and not 'page', to signify underlying implementation details may change. */
    page_token?: string;
    /** Refers to the number of individual resources to skip, not the number of pages. */
    skip: number;
};

export type ListQueryResponse<T> = {
    items: T[];
    page_size?: number;
    /** Page data is an implementation detail specific to the data. */
    page_token: string | null;
    next_page_token: string | null;
    previous_token: string | null;
    /** For constructing previous and next page URLs on the server */
    previous_href: string | null;
    next_href: string | null;
};

type OrderByDefaultConfig<T extends KeyVal> = {
    field: NestedKeys<T>[];
    direction: 'desc' | 'asc';
}[];

type PageTokenParse_base64 = {
    __typename: 'base64';
    pageToken: string | null;
    nextPageToken: null;
};

type PageTokenParse_increment = {
    __typename: 'increment';
    pageToken: number;
    nextPageToken: number | null;
};

type PageTokenParse_custom = {
    __typename: 'customer';
    pageToken: null;
    nextPageToken: null;
};

type PageTokenParsing = {
    base64: {
        pageToken: string | null;
        nextPageToken: null;
    };
    increment: { pageToken: number; nextPageToken: number | null };
    custom: { pageToken: null; nextPageToken: null };
};

export type ListQueryConfig<T extends KeyVal> = {
    orderBy: NestedKeys<T>;
    maxPageSize: number;
    /**
     * Options:
     * - base64
     * - increment
     * - custom
     *
     * @variation base64
     * @description Returns pageToken as base64 decoded page_token
     * @default return { pageToken: null | string, nextPageToken: null }
     *
     * @variation increment
     * @description Returns incremented page_token
     * @default return {pageToken: 0, nextPageToken: 1}
     *
     * @variation custom
     * @description Always returns null
     * @default return { pageToken: null, nextPageToken: null }
     */
    pageTokenParsing: keyof PageTokenParsing;
    defaults: {
        fieldMasks?: NestedKeys<T>;
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
export function parseListQuery<T extends KeyVal>(
    searchParams: URLSearchParams,
    config: ListQueryConfig<T>
) {
    const orderBy = parseOrderBy<T>(searchParams.get('order_by'), config);
    const skip = parseSkip(searchParams.get('skip'));
    const fieldMasks = parseFieldMasks<T>(
        searchParams.get('fieldMask'),
        config
    );

    const pagination = {
        ...parsePageToken(
            searchParams.get('page_token'),
            config.pageTokenParsing
        ),
        pageSize: parsePageSize<T>(searchParams.get('page_size'), config),
    };

    return {
        pagination,
        fieldMasks,
        orderBy,
        skip,
    };
}

export type OrderBy = { field: string; direction: 'asc' | 'desc' };

// TODO: allow field traversal with wildcard '*'
export function parseOrderBy<T extends KeyVal>(
    query: string | null,
    config: ListQueryConfig<T>
) {
    if (query === null)
        // TODO: figure out how to type this?
        // @ts-ignore-next-line
        return config.defaults.orderBy.reduce(
            // @ts-ignore-next-line
            (acc, curr) => {
                // @ts-ignore-next-line
                acc.push({ [curr.field]: curr.direction });
                return acc;
            },
            []
        );
    const fields = removeConsecutiveSpaces(query).split(',');
    return fields.reduce((prev: any, fieldData: string) => {
        const fieldArray = fieldData.trim().split(' ');
        console.log({ fieldArray });
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

function parsePageTokenBase64(string: string | null) {
    if (string === null) return { pageToken: null, nextPageToken: null };
    return { pageToken: decodeBase64(string), nextPageToken: null };
}

function parsePageTokenIncrement(string: string | null) {
    if (string === null) return { pageToken: 0, nextPageToken: 1 };
    const token = Number(string);
    const parsedToken = isNaN(token) ? 0 : token;
    return { pageToken: parsedToken, nextPageToken: parsedToken + 1 };
}

// Have yet to get this to properly assert type, given pageTokenParsing
function parsePageToken(
    string: string | null,
    pageTokenParsing: keyof PageTokenParsing
) {
    // : PageTokenParsing[ListQueryConfig<T>['pageTokenParsing']]
    switch (pageTokenParsing) {
        case 'base64': {
            return parsePageTokenBase64(string);
        }
        case 'increment': {
            return parsePageTokenIncrement(string);
        }
        default:
            return { pageToken: null, nextPageToken: null };
    }
}

function parsePageSize<T extends KeyVal>(
    string: string | null,
    config: ListQueryConfig<T>
) {
    if (string === null) return config.defaults.pageSize;
    const pageSize = Number(string);
    // Check if pageSize query is a number
    const parsedPageSize = isNaN(pageSize)
        ? // If not a number, use default page size
          config.defaults.pageSize
        : // If a number, ensure below configured maxPageSize
        pageSize < config.maxPageSize
        ? pageSize
        : config.maxPageSize;
    return parsedPageSize;
}

function parseSkip(string: string | null) {
    if (string === null) return 0;
    const skip = Number(string);
    // If parsed skip is not a number, skip 0 by default, otherwise return skip number
    return isNaN(skip) ? 0 : skip;
}

/**
 *
 * https://developers.google.com/slides/api/guides/field-masks
 *
 * @param string
 * @param config
 * @returns
 */
function parseFieldMasks<T extends KeyVal>(
    string: string | null,
    config: ListQueryConfig<T>
) {
    if (config.defaults.fieldMasks === undefined) return null;
    if (string === null) return config.defaults.fieldMasks;
    return string;
}
