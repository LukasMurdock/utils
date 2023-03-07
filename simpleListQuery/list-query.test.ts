// deno test simpleListQuery

import { assertEquals } from 'https://deno.land/std@0.145.0/testing/asserts.ts';
import type { ListQueryConfig } from './list-query.ts';
import { parseListQuery } from './list-query.ts';

type UserDocument = {
    email: string;
    created: string;
    contact: {
        phone: string;
    };
};

type ListQueryTest = {
    searchParams: URLSearchParams;
    listQueryConfig: ListQueryConfig<UserDocument>;
    expected: any;
};

const test1: ListQueryTest = {
    searchParams: new URLSearchParams(
        '?&order_by=email desc, created&page_token=2'
    ),
    listQueryConfig: {
        orderBy: [],
        maxPageSize: 100,
        pageTokenParsing: 'increment',
        defaults: {
            orderBy: [],
            pageSize: 10,
        },
    },
    expected: {
        pagination: { pageToken: 2, nextPageToken: 3, pageSize: 10 },
        fieldMasks: null,
        orderBy: [{ created: 'asc' }],
        skip: 0,
    },
};

const testURLSearchParams: ListQueryTest[] = [
    // Test: Default increment
    {
        searchParams: new URLSearchParams('?defaultTest::Increment'),
        listQueryConfig: {
            orderBy: [],
            maxPageSize: 100,
            pageTokenParsing: 'increment',
            defaults: {
                orderBy: [{ field: 'email', direction: 'desc' }],
                pageSize: 10,
            },
        },
        expected: {
            pagination: { pageToken: 0, nextPageToken: 1, pageSize: 10 },
            fieldMasks: null,
            orderBy: [{ email: 'desc' }],
            skip: 0,
        },
    },
    // Test: Default base64
    {
        searchParams: new URLSearchParams('?defaultTest::base64'),
        listQueryConfig: {
            orderBy: [],
            maxPageSize: 100,
            pageTokenParsing: 'base64',
            defaults: {
                orderBy: [{ field: 'email', direction: 'desc' }],
                pageSize: 10,
            },
        },
        expected: {
            pagination: { pageToken: null, nextPageToken: null, pageSize: 10 },
            fieldMasks: null,
            orderBy: [{ email: 'desc' }],
            skip: 0,
        },
    },
    // Test: Decode base64
    {
        searchParams: new URLSearchParams(
            '?defaultTest::base64&page_token=dGVzdGluZw=='
        ),
        listQueryConfig: {
            orderBy: [],
            maxPageSize: 100,
            pageTokenParsing: 'base64',
            defaults: {
                orderBy: [{ field: 'email', direction: 'desc' }],
                pageSize: 10,
            },
        },
        expected: {
            pagination: {
                pageToken: 'testing',
                nextPageToken: null,
                pageSize: 10,
            },
            fieldMasks: null,
            orderBy: [{ email: 'desc' }],
            skip: 0,
        },
    },
    // Test: No configured orderBy fields—disallow all orderby
    {
        searchParams: new URLSearchParams('?&order_by=email desc, created'),
        listQueryConfig: {
            orderBy: [],
            maxPageSize: 100,
            pageTokenParsing: 'increment',
            defaults: {
                orderBy: [],
                pageSize: 10,
            },
        },
        expected: {
            pagination: { pageToken: 0, nextPageToken: 1, pageSize: 10 },
            fieldMasks: null,
            orderBy: [],
            skip: 0,
        },
    },
    // Test: Default order by
    {
        searchParams: new URLSearchParams(
            '?&order_by=email desc, created&page_token=2'
        ),
        listQueryConfig: {
            orderBy: ['email', 'created'],
            maxPageSize: 100,
            pageTokenParsing: 'increment',
            defaults: {
                orderBy: [],
                pageSize: 10,
            },
        },
        expected: {
            pagination: { pageToken: 2, nextPageToken: 3, pageSize: 10 },
            fieldMasks: null,
            orderBy: [{ email: 'desc' }, { created: 'asc' }],
            skip: 0,
        },
    },
    // Test 3: Kitchen sink
    {
        searchParams: new URLSearchParams(
            '?&order_by=contact.phone, email desc, created&page_token=2&skip=2'
        ),
        listQueryConfig: {
            orderBy: ['email', 'created'],
            maxPageSize: 100,
            pageTokenParsing: 'increment',
            defaults: {
                orderBy: [],
                pageSize: 10,
            },
        },
        expected: {
            pagination: { pageToken: 2, nextPageToken: 3, pageSize: 10 },
            fieldMasks: null,
            orderBy: [{ email: 'desc' }, { created: 'asc' }],
            skip: 2,
        },
    },
];

const searchParams = new URLSearchParams(
    '?&order_by=email desc, created&page_token=2'
);

const queryConfig: ListQueryConfig<UserDocument> = {
    orderBy: ['created', 'email'],
    maxPageSize: 100,
    pageTokenParsing: 'increment',
    defaults: {
        orderBy: [{ field: 'created', direction: 'asc' }],
        pageSize: 10,
    },
};

const queryObject = parseListQuery<UserDocument>(searchParams, queryConfig);

queryObject.pagination.pageToken;

console.log(searchParams.toString());
console.log({ queryObject });

testURLSearchParams.forEach((test) => {
    Deno.test(test.searchParams.toString(), () => {
        // console.log(testArray[0].toString());
        // const input = 'http://localhost:3000';

        assertEquals(
            // @ts-ignore
            parseListQuery(test.searchParams, test.listQueryConfig),
            test.expected
        );
    });
});
