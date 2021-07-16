export function epochToDate(epoch: number): Date {
    return new Date(epoch * 1000);
}
