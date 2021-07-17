export function epochToDate(epoch: number): Date {
    return new Date(epoch * 1000);
}

export function dateToEpoch(date: Date): number {
    return date.getTime() / 1000;
}
