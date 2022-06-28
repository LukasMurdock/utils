import { removeSpaces } from './textUtils.ts';

export type OrderBy = { field: string; direction: 'asc' | 'desc' };

type OrderByConfig<T> = Array<keyof T>;

type RequestSearchParamsConfig<T> = {
    orderBy?: OrderByConfig<T>;
};

// [K in keyof T]: FooValue<T[K]>

// Order-by only works one level deep.
// Could have nested arrays for defining acceptable traversals
export function parseRequestSearchParams<T>(
    request: Request,
    config: RequestSearchParamsConfig<T>
) {
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    const orderByParams = searchParams.get('order_by');
    const orderBy =
        orderByParams && config.orderBy
            ? parseOrderBy<T>(orderByParams, config.orderBy)
            : null;

    return {
        ...(orderBy && { orderBy }),
    };
}

// TODO: allow field traversal with '.' and wildcard '*'
export function parseOrderBy<T>(
    query: string,
    acceptableFields: OrderByConfig<T>
) {
    const fields = removeSpaces(query);
    const fieldArray = fields.split(',');
    return fieldArray.reduce(
        (prev: Array<keyof T | string>, fieldData: string) => {
            // @ts-ignore-next-line
            if (!acceptableFields.includes(fieldData)) {
                return prev;
            }
            return [...prev, fieldData];
        },
        []
    ) as Array<keyof T>;
}
