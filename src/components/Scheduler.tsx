import React, { useEffect, useState } from 'react';
import { useAuth } from './AuthProvider';
import { useApi } from '../api/starskyApiClient';
import { Button, Dimmer, Divider, Icon, Label, List, Loader, Progress, Table } from 'semantic-ui-react';
import { ScheduleResponse, ScheduleShiftResponse, UserResponse } from '../api/__generated__';
import { epochToDate } from '../util/dateHelper';
import { ShiftsModal } from './modals/ShiftsModal';
import { logAndFormatError } from '../util/errorHelper';
import { ConfirmActionModal } from './modals/ConfirmActionModal';

interface IScheduleShiftProps {
    employees: UserResponse[];
    schedule: ScheduleResponse;
}
export const Scheduler: React.FC<IScheduleShiftProps> = (props: IScheduleShiftProps) => {
    const [loading, setLoading] = useState(true);
    const [shifts, setShifts] = useState<ScheduleShiftResponse[]>([]);
    const { token } = useAuth();
    const apis = useApi(token);

    const startDate = epochToDate(props.schedule.scheduleStart);
    const endDate = epochToDate(props.schedule.scheduleEnd);
    const totalScheduleDays = getTotalDays();

    useEffect(() => {
        onLoad();
    }, []);

    async function onLoad() {
        setLoading(true);
        await apis.scheduleShiftApi
            .getScheduleShifts({ scheduleId: props.schedule.id })
            .then((scheduleShifts) => setShifts(scheduleShifts))
            .catch((reason) => alert(logAndFormatError(reason)))
            .finally(() => setLoading(false)); //todo
    }

    function getScheduleDatesHeaders(): JSX.Element[] {
        const headers: JSX.Element[] = [];
        for (const date of getScheduleDates()) {
            headers.push(<Table.HeaderCell key={`sdh-${date.toISOString()}`} content={date.format('ddd, MMM DD')} />);
        }
        return headers;
    }

    function getScheduleDates() {
        const dates = [];
        for (let i = 0; i <= totalScheduleDays; i++) {
            const currentDate = startDate.add(i, 'day');
            dates.push(currentDate);
        }
        return dates;
    }

    function getTotalDays(): number {
        return endDate.diff(startDate, 'day');
    }

    function addNewShift(employeeId: number) {
        console.log(employeeId);
    }

    function getEmployeeCells(employeeId: number) {
        const cells: JSX.Element[] = [];
        for (let i = 0; i <= totalScheduleDays; i++) {
            cells.push(
                <Table.Cell key={`tc-${employeeId}-${i}`} selectable className="hoverable">
                    <a href="#" onClick={() => addNewShift(employeeId)}>
                        <Icon name="plus" size="large" className="show-on-hover" disabled />
                    </a>
                </Table.Cell>,
            );
        }
        return cells;
    }

    const onDeleteShift = async (shiftId: number) => {
        setLoading(true);
        apis.scheduleShiftApi
            .deleteScheduleShift({ shiftId: shiftId })
            .then(() => setShifts(shifts.filter((shift) => shift.id != shiftId)))
            .catch((reason) => logAndFormatError(reason)) //todo: show error modal
            .finally(() => setLoading(false));
    };

    const getAvailableShiftHeaders = () => {
        const headers: JSX.Element[] = [];
        for (const date of getScheduleDates()) {
            const availableShifts = shifts.filter((shift) => epochToDate(shift.shiftStart).date() == date.date());
            headers.push(
                <Table.HeaderCell key={`ash-${date.toISOString()}`}>
                    {availableShifts
                        .sort((a, b) => a.shiftStart - b.shiftStart)
                        .map((shift, index) => (
                            <>
                                <a href={'#'}>{`${epochToDate(shift.shiftStart).format('HH:mm')} - ${epochToDate(shift.shiftEnd).format('HH:mm')}`}</a>
                                <Progress
                                    key={`li-${date.toISOString()}${shift.id}`}
                                    autoSuccess
                                    value={1}
                                    progress="ratio"
                                    total={shift.numberOfRequiredEmployees}
                                    style={{ marginTop: 5, marginBottom: 5 }}
                                />

                                {index != availableShifts.length - 1 && <Divider />}
                            </>
                        ))}
                </Table.HeaderCell>,
            );
        }
        return headers;
    };

    return loading ? (
        <Dimmer active inverted>
            <Loader content="Please wait..." />
        </Dimmer>
    ) : (
        <Table celled unstackable={true} verticalAlign="middle" textAlign="center">
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>
                        <ShiftsModal
                            trigger={<Button primary content="Create shift(s)" size="small" compact />}
                            employees={props.employees}
                            scheduleDates={getScheduleDates()}
                            schedule={props.schedule}
                            onShiftsCreated={() => onLoad()}
                        />
                    </Table.HeaderCell>
                    {getScheduleDatesHeaders()}
                </Table.Row>
                <Table.Row>
                    <Table.HeaderCell content={'Available shifts'} />
                    {getAvailableShiftHeaders()}
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {props.employees.map((employee) => {
                    return (
                        <Table.Row key={employee.id}>
                            <Table.Cell collapsing>
                                {employee.name}
                                <br />
                                <Icon name="clock outline" />
                                8h {/* TODO calculate total hours of employee*/}
                            </Table.Cell>
                            {getEmployeeCells(employee.id)}
                        </Table.Row>
                    );
                })}
            </Table.Body>
        </Table>
    );
};
