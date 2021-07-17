import React, { useEffect, useState } from 'react';
import { useAuth } from './AuthProvider';
import { useApi } from '../api/starskyApiClient';
import { Grid, Table } from 'semantic-ui-react';
import { ScheduleShiftResponse } from '../api/__generated__';
import { epochToDate } from '../util/dateHelper';
import { groupBy } from '../util/arrayHelper';
interface IScheduleShiftProps {
    shifts: ScheduleShiftResponse[];
}
export const ScheduleShiftsTable: React.FC<IScheduleShiftProps> = (props: IScheduleShiftProps) => {
    const [loading, setLoading] = useState(true);
    const { token } = useAuth();
    const apis = useApi(token);

    const groupedShifts = groupBy(props.shifts, (shift) => epochToDate(shift.shiftStart).get('date'));

    useEffect(() => {
        onLoad();
    }, []);

    async function onLoad() {
        //todo
    }

    if (props.shifts.length == 0) {
        //todo: return something else?
        return <></>;
    }

    return (
        <Grid columns="equal">
            {Array.from(groupedShifts.values()).map((scheduleShifts, index) => {
                return (
                    <Grid.Column key={index}>
                        <Table>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell textAlign="center" content={epochToDate(scheduleShifts[0].shiftStart).toDate().toLocaleDateString()} />
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {scheduleShifts.map((scheduleShift) => {
                                    const shiftComponents: JSX.Element[] = [];
                                    const startDate = epochToDate(scheduleShift.shiftStart);
                                    const endDate = epochToDate(scheduleShift.shiftEnd);
                                    console.log(startDate.toISOString());
                                    console.log(endDate.toISOString());
                                    for (let i = 0; i <= endDate.diff(startDate, 'hour'); i++) {
                                        const currentDate = startDate.add(i, 'hour');
                                        shiftComponents.push(
                                            <Table.Header key={currentDate.unix()}>
                                                <Table.Row>
                                                    <Table.Cell textAlign="center" content={currentDate.format('HH:mm')} />
                                                </Table.Row>
                                            </Table.Header>,
                                        );
                                    }

                                    return shiftComponents;
                                })}
                            </Table.Body>
                            {/*<Table.Footer>*/}
                            {/*    <Table.Row>im a footer</Table.Row>*/}
                            {/*</Table.Footer>*/}
                        </Table>
                    </Grid.Column>
                );
            })}
        </Grid>
    );
};
