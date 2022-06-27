// deno test tests/base64.test.ts
import { assertEquals } from 'https://deno.land/std@0.145.0/testing/asserts.ts';
import { encodeBase64, decodeBase64 } from '../base64.ts';

Deno.test('Base64 Encode URL', () => {
    const input = 'http://localhost:3000';
    assertEquals(encodeBase64(input), 'aHR0cDovL2xvY2FsaG9zdDozMDAw');
});

Deno.test('Base64 Decode URL', () => {
    const input = 'aHR0cDovL2xvY2FsaG9zdDozMDAw';
    assertEquals(decodeBase64(input), 'http://localhost:3000');
});
