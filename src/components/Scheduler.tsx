import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from './AuthProvider';
import { useApi } from '../api/starskyApiClient';
import { Button, Dimmer, Divider, Grid, Icon, Label, Loader, Progress, Ref, Table } from 'semantic-ui-react';
import { EmployeeAssignmentResponse, EmployeeAvailabilityResponse, ScheduleResponse, ScheduleShiftResponse, UserResponse } from '../api/__generated__';
import { dateToDurationString, epochToDate, shiftToString } from '../util/dateHelper';
import { ShiftsModal } from './modals/ShiftsModal';
import { logAndFormatError } from '../util/errorHelper';
import { EditShiftModal } from './modals/EditShiftModal';
import { ErrorModal } from './modals/ErrorModal';
import { Dayjs } from 'dayjs';
import { AssignmentModal } from './modals/AssignmentModal';
import { generateUniqueID } from 'web-vitals/dist/lib/generateUniqueID';

interface IScheduleShiftProps {
    employees: UserResponse[];
    schedule: ScheduleResponse;
}
export const Scheduler: React.FC<IScheduleShiftProps> = (props: IScheduleShiftProps) => {
    const [loading, setLoading] = useState(true);
    const [shifts, setShifts] = useState<ScheduleShiftResponse[]>([]);
    const [availabilities, setAvailabilities] = useState<{ shiftId: number; availabilities: EmployeeAvailabilityResponse[] }[]>([]);
    const [assignments, setAssignments] = useState<EmployeeAssignmentResponse[]>([]);
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

        await apis.employeeAssignmentApi
            .getEmployeeAssignments({ scheduleId: props.schedule.id })
            .then((assignmentResponse) => {
                setAssignments(assignmentResponse.sort((a, b) => a.assignmentStart - b.assignmentStart));
            })
            .catch((reason) => setError({ message: logAndFormatError(reason), occurred: true }));

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

    const getNumberOfAssignedEmployees = (shiftId: number) => {
        return assignments.filter((assignment) => assignment.shiftId == shiftId).length;
    };

    const getEmployeeTotalHours = (employeeId: number) => {
        return (
            assignments
                .filter((assignment) => assignment.employeeId == employeeId)
                .map((assignment) => Math.abs(assignment.assignmentEnd - assignment.assignmentStart))
                .reduce((prev, next) => prev + next, 0) / 3600
        );
    };

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

    const onShiftsCreatedWithAssignment = async (shifts: ScheduleShiftResponse[], employeeId: number) => {
        setLoading(true);
        const promises = [];
        for (const shift of shifts) {
            promises.push(
                apis.employeeAssignmentApi
                    .postEmployeeAssignment({
                        employeeId: employeeId,
                        shiftId: shift.id,
                        scheduleId: props.schedule.id,
                        createEmployeeAssignmentRequest: { assignmentStart: shift.shiftStart, assignmentEnd: shift.shiftEnd },
                    })
                    .then((assignment) => {
                        setAssignments((previousState) => [...previousState, assignment].sort((a, b) => a.assignmentStart - b.assignmentStart));
                    }),
            );
        }
        await Promise.all(promises)
            .then(async () => await onLoad())
            .catch((reason) => setError({ message: logAndFormatError(reason), occurred: true }))
            .finally(() => setLoading(false));
    };

    const getNoShiftModal = (employeeId: number, date: Dayjs, trigger: JSX.Element, i: number) => (
        <ShiftsModal
            key={`noshift-modal-emp-${employeeId}${i}`}
            trigger={trigger}
            employees={props.employees}
            scheduleDates={getScheduleDates()}
            schedule={props.schedule}
            onShiftsCreated={(shifts) => onShiftsCreatedWithAssignment(shifts, employeeId)}
            selectedDate={date}
            selectedEmployeeId={employeeId}
        />
    );

    const onAssignmentConfirmation = async (selectedShifts: ScheduleShiftResponse[], employeeId: number) => {
        setLoading(true);
        for (const shift of selectedShifts) {
            await apis.employeeAssignmentApi
                .postEmployeeAssignment({
                    employeeId: employeeId,
                    scheduleId: props.schedule.id,
                    shiftId: shift.id,
                    createEmployeeAssignmentRequest: { assignmentStart: shift.shiftStart, assignmentEnd: shift.shiftEnd },
                })
                .then((assignment) => setAssignments((prevState) => [...prevState, assignment]))
                .catch((reason) => setError({ message: logAndFormatError(reason), occurred: true }));
        }
        setLoading(false);
    };

    const getEmployeeCellBody = (
        employeeAssignments: EmployeeAssignmentResponse[],
        availableShifts: ScheduleShiftResponse[],
        employeeId: number,
        date: Dayjs,
        i: number,
    ) => {
        const body: JSX.Element[] = [];

        for (const assignment of employeeAssignments.sort((a, b) => a.assignmentStart - b.assignmentStart)) {
            body.push(
                <Grid.Row key={`btn-${assignment.id}-${i}`}>
                    <Button
                        compact
                        content={dateToDurationString(assignment.assignmentStart, assignment.assignmentEnd)}
                        style={{ marginTop: 4, marginBottom: 4 }}
                    />
                </Grid.Row>,
            );
        }

        const noShiftsAvailable = (employeeAssignments.length == 0 && availableShifts.length == 0) || employeeAssignments.length == availableShifts.length;
        let trigger: JSX.Element | undefined = undefined;
        if (employeeAssignments.length > 0) {
            trigger = (
                <a href="#" style={{ paddingTop: 0, paddingBottom: 5 }}>
                    <Icon name="plus" className="show-on-hover" disabled />
                </a>
            );
        } else if ((employeeAssignments.length == 0 && availableShifts.length > 0) || noShiftsAvailable) {
            trigger = (
                <a href="#">
                    <Icon name="plus" size="large" className="show-on-hover" disabled />
                </a>
            );
        }
        if (trigger) {
            if (noShiftsAvailable) {
                body.push(getNoShiftModal(employeeId, date, trigger, i));
            } else {
                body.push(
                    <AssignmentModal
                        onConfirmation={(selectedShifts) => onAssignmentConfirmation(selectedShifts, employeeId)}
                        trigger={trigger}
                        shifts={availableShifts.filter(
                            (shift) =>
                                !employeeAssignments.some(
                                    (assignment) => assignment.assignmentStart == shift.shiftStart && assignment.assignmentEnd == shift.shiftEnd,
                                ),
                        )}
                        key={`ass-modal-emp-${employeeId}${i}`}
                    />,
                );
            }
        }

        return body;
    };

    const getEmployeeCells = (employeeId: number) => {
        const cells: JSX.Element[] = [];

        const dates = getScheduleDates();
        for (let i = 0; i < dates.length; i++) {
            const date = dates[i];
            const availableShifts = shifts.filter((shift) => epochToDate(shift.shiftStart).date() == date.date());
            const employeeAssignments = assignments.filter(
                (assignment) => assignment.employeeId == employeeId && availableShifts.some((shift) => shift.id == assignment.shiftId),
            );
            cells.push(
                <Table.Cell key={`tc-${i}-employee-${employeeId}`} selectable className="hoverable">
                    {getEmployeeCellBody(employeeAssignments, availableShifts, employeeId, date, i)}
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
        setAvailabilities(availabilities.filter((availability) => availability.shiftId != shiftId));
        setAssignments(assignments.filter((assignment) => assignment.shiftId != shiftId));
    };

    const getAvailableShiftHeaders = () => {
        const headers: JSX.Element[] = [];
        for (const date of getScheduleDates()) {
            const availableShifts = shifts.filter((shift) => epochToDate(shift.shiftStart).date() == date.date());
            headers.push(
                <Table.HeaderCell key={`ash-${date.toISOString()}`}>
                    {availableShifts.length == 0 && (
                        <ShiftsModal
                            trigger={<Button primary content="Add" size="small" compact icon="add" />}
                            employees={props.employees}
                            scheduleDates={getScheduleDates()}
                            schedule={props.schedule}
                            onShiftsCreated={() => onLoad()}
                            selectedDate={date}
                        />
                    )}
                    {availableShifts
                        .sort((a, b) => a.shiftStart - b.shiftStart)
                        .map((shift, index) => (
                            <div key={`li-${date.toISOString()}${shift.id}`}>
                                <EditShiftModal
                                    trigger={<Button compact fluid content={shiftToString(shift)} />}
                                    shift={shift}
                                    availabilities={availabilities.find((x) => x.shiftId == shift.id)?.availabilities ?? []}
                                    employees={props.employees}
                                    schedule={props.schedule}
                                    onShiftEdited={onShiftEdited}
                                    onShiftDeleted={onShiftDeleted}
                                />

                                <Progress
                                    autoSuccess
                                    value={getNumberOfAssignedEmployees(shift.id)}
                                    size="small"
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

    const getEmployeeInfoCell = (employee: UserResponse) => {
        const currentHours = getEmployeeTotalHours(employee.id);
        const maxHours = props.schedule.maxHoursPerEmployee;

        const currentShifts = assignments.filter((assignment) => assignment.employeeId == employee.id).length;
        const maxShifts = props.schedule.maxShiftsPerEmployee;

        return (
            <>
                {employee.name}
                <br />
                <Icon name="clock outline" />
                <label className={currentHours > maxHours ? 'negativeThick' : 'positiveThick'}>
                    {currentHours}/{maxHours}h
                </label>
                <br />
                <Icon name="calendar check outline" />
                <label className={currentShifts > maxShifts ? 'negativeThick' : 'positiveThick'}>
                    {currentShifts}/{maxShifts} shifts
                </label>
            </>
        );
    };

    return loading ? (
        <Dimmer active inverted>
            <Loader content="Please wait..." />
        </Dimmer>
    ) : (
        <Table celled unstackable={true} verticalAlign="middle" textAlign="center" fixed>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell style={{ width: '10%' }}>
                        <ShiftsModal
                            trigger={<Button primary content="Create shifts" size="small" compact />}
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
                {props.employees.map((employee, index) => {
                    return (
                        <Table.Row key={`emp-info-${employee.id}${index}`}>
                            <Table.Cell>{getEmployeeInfoCell(employee)}</Table.Cell>
                            {getEmployeeCells(employee.id)}
                        </Table.Row>
                    );
                })}
            </Table.Body>
        </Table>
    );
};
