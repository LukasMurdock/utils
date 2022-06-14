export function allTrue(array: any) {
    return array.reduce((prev: boolean, curr: boolean) => {
        if (!prev) {
            return false;
        }
        if (curr) {
            return true;
        }
        return false;
    }, true);
}

export async function allTrueAsync(array: any) {
    await array.reduce(
        async (prev: Promise<boolean>, curr: () => Promise<boolean>) => {
            if (!prev) {
                return false;
            }
            if (await curr()) {
                return true;
            }
            return false;
        },
        Promise.resolve(true)
    );
}
