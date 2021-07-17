import dayjs, { Dayjs } from 'dayjs';

export function epochToDate(epoch: number): Dayjs {
    return dayjs.unix(epoch);
}

export function dateToEpoch(date: Date): number {
    return date.getTime() / 1000;
}
