// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/race#using_promise.race_%E2%80%93_examples_with_settimeout

export function withTimeout(msDelay: number, promise: Promise<unknown>) {
    const timeout = new Promise((_, reject) => {
        setTimeout(() => {
            reject(new Error('timeout'));
        }, msDelay);
    });
    return Promise.race([timeout, promise]);
}
