import React, { useEffect, useState } from 'react';
import { useAuth } from './AuthProvider';
import { useApi } from '../api/starskyApiClient';
import { Button, Dimmer, Icon, Loader, Table } from 'semantic-ui-react';
import { ScheduleResponse, ScheduleShiftResponse, UserResponse } from '../api/__generated__';
import { epochToDate } from '../util/dateHelper';
import { ShiftsModal } from './modals/ShiftsModal';
import { logAndFormatError } from '../util/errorHelper';

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

    function getTableHeaders(): JSX.Element[] {
        const headers: JSX.Element[] = [];
        for (const date of getScheduleDates()) {
            headers.push(<Table.HeaderCell key={date.toISOString()} textAlign="center" content={date.format('ddd, MMM DD')} />);
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
                    {getTableHeaders()}
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
