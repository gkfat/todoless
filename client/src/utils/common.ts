export const checkNull = (value: string | null | undefined) => {
    if (!value || String(value).length === 0) {
        return '-';
    }

    return value;
};

export const sleepSeconds = (seconds: number) => new Promise(
    (resolve) => {
        setTimeout(() => resolve(null), seconds * 1000);
    },
);
