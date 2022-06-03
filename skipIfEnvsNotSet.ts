import { describe, SuiteFactory } from 'vitest';

/**
 * Skip test suite if required environment variables are not set.
 * @param envs Environment variable keys required for the test
 * @param suite the test suite to run
 * @returns
 */
export default function skipIfEnvsNotSet(
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
