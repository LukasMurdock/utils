type KeyVal = Record<string, unknown>;

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

// type TestType = Either<{left: 'left'}, {right: 'right'}>

// const testType1: TestType = {left: 'left'}
// const testType2: TestType = {right: 'right'}
// const testType3: TestType = {left: 'left', right: 'right'}
