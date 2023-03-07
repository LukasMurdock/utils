# Simple Query Params

[URL](https://developer.mozilla.org/en-US/docs/Web/API/URL) -> [URLSearchParams](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams) -> API Config -> Simple Query -> Adapt to Prisma Query, Firestore Query, etc.

1. URL
2. URLSearchParams
3. API Config
4. Simple Query Object
5. Prisma Query Adapter

String -> parseFunction(string | number | boolean | enum(string, number))

```typescript
// be able to pass in custom props to apiDesign functions
const api = simpleQueryParams({
    size: (val) => parseNumber(val, { fallback: 10, min: 1, max: 2 }),
    cursor: (val) => parseNumber(val, { fallback: 0, min: 0, max: 100 }),
    string: (val) => (val ? 'false' : 'true'),
});
```

-   fallback: undefined

type enum: (array.includes())

-   type: string | number
-

type string:

-   min?
-   max?
-   fallback(undefined | string)

-   string -> number | enum(string, number)

type: number:

-   min?
-   max?
-   fallback(undefined | number)

```typescript
    z.object({
        stringParam = z.string(),
        stringEnum = z.enum(["Fish", "Tuna"]).default("Fish")
        numParam =
    })
```
