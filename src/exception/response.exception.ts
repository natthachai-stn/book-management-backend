

export function responseException<T>(
    message: string,
    data: T[] = [],
    total?: number,
) {
    return {
        message,
        data,
        total
    };
}
