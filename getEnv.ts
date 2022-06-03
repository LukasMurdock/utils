// https://dev.to/austinshelby/you-are-reading-environment-variables-the-wrong-way-in-nextjs-45da

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
