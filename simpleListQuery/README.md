# Simple List Query

Lifting (some, if not all) table state up to the URL enables server-side rendering of sorted tables.

The goal here is to easily build simple List APIs with pagination, sorting, filtering(TODO?), and masking.

### Easy as 1-2-3

Step 1: Configure list API

Step 2: Parse query parameters server-side for database query. (Then define page_token and next_page_token)

Step 3: Parse query parameters client-side to determine sorted table fields and sort direction.

## (Optional) Request query parameters

-   filter
-   fields
-   order_by
-   page_size
-   page_token
-   skip

## Response fields

-   items[]
-   max_pages (optional, will require heavier db call)
-   page_token
-   next_page_token (nullable if no more pages)

Configure:

-   Default field sorts and sort direction
-   Allowable field sorts
    -   If empty, just use default
-   Default field mask
-   Allowable field masks
    -   If empty just use default
-   Default page size
-   Max page size
-   Page token parsing
    -   String options:
        -   base64
        -   incrementNumber
        -   custom

## Wishlist

-   Filter string parsing
-   Better field mask parsing
-   adapters:
    -   query (Prisma or Firebase)
    -   collection (Prisma or firebase collection type)

### Filter string parsing

Currently not implemented at all.

### Better field mask parsing

Current field mask parsing implementation accepts single nested fields in the form of: `contact.email, contact.phone`.

Ideally, it could parse `contact(email, phone)`
