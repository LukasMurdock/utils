// https://github.com/airjp73/remix-validated-form/blob/main/packages/zod-form-data/src/helpers.ts
import { z } from 'https://deno.land/x/zod/mod.ts';
import type {
    ZodTypeAny,
    ZodEffects,
    ZodNumber,
} from 'https://deno.land/x/zod/mod.ts';

type InputType<DefaultType extends ZodTypeAny> = {
    (): ZodEffects<DefaultType>;
    <ProvidedType extends ZodTypeAny>(
        schema: ProvidedType
    ): ZodEffects<ProvidedType>;
};

const stripEmpty = z.literal('').transform(() => undefined);

const preprocessIfValid = (schema: ZodTypeAny) => (val: unknown) => {
    const result = schema.safeParse(val);
    if (result.success) return result.data;
    return val;
};

export const numeric: InputType<ZodNumber> = (schema = z.number()) =>
    z.preprocess(
        preprocessIfValid(
            z.union([
                stripEmpty,
                z
                    .string()
                    .transform((val) => Number(val))
                    .refine((val) => !Number.isNaN(val)),
            ])
        ),
        schema
    );
