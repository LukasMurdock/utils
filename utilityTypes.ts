export type KeyVal = Record<string, unknown>;

export type GetObjectKeyVals<T extends KeyVal> = {
    [K in keyof T]: T[K];
};

export type NeverRight<
    L extends KeyVal,
    R extends KeyVal
> = GetObjectKeyVals<L> & { [K in keyof R]?: never };

export type Either<L extends KeyVal, R extends KeyVal> =
    | NeverRight<L, R>
    | NeverRight<R, L>;

export type NestedKeys<Type extends KeyVal> = {
    [Key in keyof Type]: Type[Key] extends KeyVal
        ? // @ts-ignore
          `${Key}` | `${Key}.${NestedKeyOf<Type[Key]>}`
        : Key;
}[Extract<keyof Type, string>];

// type TestType = Either<{left: 'left'}, {right: 'right'}>

// const testType1: TestType = {left: 'left'}
// const testType2: TestType = {right: 'right'}
// const testType3: TestType = {left: 'left', right: 'right'}
