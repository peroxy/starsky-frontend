import dayjs, { Dayjs } from 'dayjs';
import { ScheduleShiftResponse } from '../api/__generated__';

export const epochToDate = (epoch: number): Dayjs => dayjs.unix(epoch);

export const dateToEpoch = (date: Date): number => date.getTime() / 1000;

export const dateToDurationString = (startDateUnix: number, endDateUnix: number) => {
    return `${epochToDate(startDateUnix).format('HH:mm')} - ${epochToDate(endDateUnix).format('HH:mm')}`;
};

export const shiftToString = (shift: ScheduleShiftResponse) => {
    return dateToDurationString(shift.shiftStart, shift.shiftEnd);
};
