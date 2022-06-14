import { SuiteFactory, describe } from 'vitest';


export function skipIfFalse(
    functions: { (): boolean }[],
    suite: [name: string, factory?: SuiteFactory | undefined]
) {
    const allTrue = functions.reduce((prev, curr) => {
        if (!prev) {
            return false;
        }
        if (curr()) {
            return true;
        }
        return false;
    }, true);
    if (allTrue) {
        return describe(suite[0], suite[1]);
    } else {
        return describe.skip(suite[0], suite[1]);
    }
}

/**
 * Usage:
 * ```
 * skipIfEnvsNotSet(
    ['DATABASE_EMULATOR', 'DATABASE_URL'],
    [
        'Database',
        () => {
            it('Create User', async () => {
                const userRecord = await createUser(exampleUser);
                assert.equal(userRecord.email, exampleUser.email);
            });
        }
    ]
)
 * ```
 * @param envs
 * @param suite
 * @returns
 */
export function skipIfEnvsNotSet(
    envs: string[],
    suite: [name: string, factory?: SuiteFactory | undefined]
) {
    const allEnvsExist = envs.reduce((prev, curr) => {
        if (!prev) {
            return false;
        }
        if (process.env[curr]) {
            return true;
        }
        return false;
    }, true);
    if (allEnvsExist) {
        return describe(suite[0], suite[1]);
    } else {
        return describe.skip(suite[0], suite[1]);
    }
}
