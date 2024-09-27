import type { PromiseError, PromiseTuple } from '@@types/promises.js';

export async function handle<T, D = Error>(promise: Promise<T>): PromiseTuple<T, D> {
    return promise
    .then((results: T) => {
        return [results, undefined] as [T, undefined];
    })
    .catch((err: PromiseError<D>) => {
        return [undefined, err]
    });
};