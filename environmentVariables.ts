// https://dev.to/austinshelby/you-are-reading-environment-variables-the-wrong-way-in-nextjs-45da

/**
 * Validates every string in a given array exists as a Node environment variable.
 * @requires Node.js
 * @param envs
 * @returns boolean
 */
export function allEnvsExist(envs: string[]) {
    const allEnvsExist = envs.reduce((prev, curr) => {
        if (!prev) {
            return false;
        }
        if (process.env[curr]) {
            return true;
        }
        return false;
    }, true);
    return allEnvsExist;
}

/**
 * Validates a given string exists as a Node environment variable.
 * @requires Node.js
 * @param environmentVariable
 * @returns Node environment variable string
 * @throws Error: Couldn't find environment variable: ${environmentVariable}
 */
const getEnvironmentVariable = (environmentVariable: string): string => {
    const unvalidatedEnvironmentVariable = process.env[environmentVariable];
    if (!unvalidatedEnvironmentVariable) {
        throw new Error(
            `Couldn't find environment variable: ${environmentVariable}`
        );
    } else {
        return unvalidatedEnvironmentVariable;
    }
};

export const config = {
    envAccessKey: getEnvironmentVariable('ENVIRONMENT_VARIABLE'),
};
