// deno run tests/queryString.ts

import { ApiDesignConfig, parseURLSearchParams } from '../queryString.ts';

type UserDocument = {
    email: string;
    created: string;
    nested: {
        field: string;
    };
};

const routeConfig: ApiDesignConfig<UserDocument> = {
    orderBy: ['nested.field'],
    maxPageSize: 100,
    defaults: {
        orderBy: [
            {
                field: 'nested.field',
                direction: 'asc',
            },
        ],
        pageSize: 10,
    },
};

const searchParams = new URLSearchParams('?order_by=nested.field desc, email');

const parsedSearchParams = parseURLSearchParams<UserDocument>(
    searchParams,
    routeConfig
);

console.log(parsedSearchParams);
