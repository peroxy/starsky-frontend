import React, { useEffect, useState } from 'react';
import { useAuth } from './AuthProvider';
import { useApi } from '../api/starskyApiClient';
import { Button, Dimmer, Divider, Icon, Loader, Progress, Table } from 'semantic-ui-react';
import { EmployeeAvailabilityResponse, ScheduleResponse, ScheduleShiftResponse, UserResponse } from '../api/__generated__';
import { epochToDate } from '../util/dateHelper';
import { ShiftsModal } from './modals/ShiftsModal';
import { logAndFormatError } from '../util/errorHelper';
import { EditShiftModal } from './modals/EditShiftModal';
import { ErrorModal } from './modals/ErrorModal';

interface IScheduleShiftProps {
    employees: UserResponse[];
    schedule: ScheduleResponse;
}
export const Scheduler: React.FC<IScheduleShiftProps> = (props: IScheduleShiftProps) => {
    const [loading, setLoading] = useState(true);
    const [shifts, setShifts] = useState<ScheduleShiftResponse[]>([]);
    const [availabilities, setAvailabilities] = useState<{ shiftId: number; availabilities: EmployeeAvailabilityResponse[] }[]>([]);
    const [error, setError] = useState<{ occurred: boolean; message: string }>({ occurred: false, message: '' });
    const { token } = useAuth();
    const apis = useApi(token);

    const startDate = epochToDate(props.schedule.scheduleStart);
    const endDate = epochToDate(props.schedule.scheduleEnd);

    const getTotalDays = (): number => endDate.diff(startDate, 'day');

    const totalScheduleDays = getTotalDays();

    useEffect(() => {
        onLoad();
    }, []);

    async function onLoad() {
        setLoading(true);
        await apis.scheduleShiftApi
            .getScheduleShifts({ scheduleId: props.schedule.id })
            .then(async (scheduleShifts) => {
                setShifts(scheduleShifts);
                const requests = [];
                for (const scheduleShift of scheduleShifts) {
                    requests.push(
                        apis.employeeAvailabilityApi
                            .getEmployeeAvailabilities({ shiftId: scheduleShift.id })
                            .then((availability) => {
                                setAvailabilities((previousState) => [...previousState, { shiftId: scheduleShift.id, availabilities: availability }]);
                            })
                            .catch((reason) => setError({ message: logAndFormatError(reason), occurred: true })),
                    );
                }
                await Promise.all(requests);
            })
            .catch((reason) => setError({ message: logAndFormatError(reason), occurred: true }))
            .finally(() => setLoading(false));
    }

    const getScheduleDatesHeaders = (): JSX.Element[] => {
        const headers: JSX.Element[] = [];
        for (const date of getScheduleDates()) {
            headers.push(<Table.HeaderCell key={`sdh-${date.toISOString()}`} content={date.format('ddd, MMM DD')} />);
        }
        return headers;
    };

    const getScheduleDates = () => {
        const dates = [];
        for (let i = 0; i <= totalScheduleDays; i++) {
            const currentDate = startDate.add(i, 'day');
            dates.push(currentDate);
        }
        return dates;
    };

    const addNewShift = (employeeId: number) => {
        console.log(employeeId);
    };

    const getEmployeeCells = (employeeId: number) => {
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
    };

    const onShiftEdited = async (shift: ScheduleShiftResponse) => {
        setLoading(true);
        const updateShifts = [...shifts];
        updateShifts[updateShifts.findIndex((x) => x.id == shift.id)] = shift;
        setShifts(updateShifts);

        const updatedAvailabilities = [...availabilities];
        apis.employeeAvailabilityApi
            .getEmployeeAvailabilities({ shiftId: shift.id })
            .then((value) => {
                updatedAvailabilities[updatedAvailabilities.findIndex((x) => x.shiftId == shift.id)] = { shiftId: shift.id, availabilities: value };
                setAvailabilities(updatedAvailabilities);
            })
            .catch((reason) => setError({ message: logAndFormatError(reason), occurred: true }))
            .finally(() => setLoading(false));
    };

    const onShiftDeleted = (shiftId: number) => {
        setShifts(shifts.filter((shift) => shift.id != shiftId));
        setAvailabilities(availabilities.filter((shift) => shift.shiftId != shiftId));
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
                            <div key={`li-${date.toISOString()}${shift.id}`}>
                                <EditShiftModal
                                    trigger={
                                        <Button compact fluid>{`${epochToDate(shift.shiftStart).format('HH:mm')} - ${epochToDate(shift.shiftEnd).format(
                                            'HH:mm',
                                        )}`}</Button>
                                    }
                                    shift={shift}
                                    availabilities={availabilities.find((x) => x.shiftId == shift.id)?.availabilities ?? []}
                                    employees={props.employees}
                                    schedule={props.schedule}
                                    onShiftEdited={onShiftEdited}
                                    onShiftDeleted={onShiftDeleted}
                                />

                                <Progress
                                    autoSuccess
                                    value={1} //todo
                                    size={'small'}
                                    progress="ratio"
                                    total={shift.numberOfRequiredEmployees}
                                    style={{ marginTop: 5, marginBottom: 5 }}
                                />

                                {index != availableShifts.length - 1 && <Divider />}
                            </div>
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
                {error.occurred && <ErrorModal errorMessage={error.message} />}
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
