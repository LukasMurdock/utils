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
    console.log('allEnvsExist: ' + allEnvsExist);
    return allEnvsExist;
}
