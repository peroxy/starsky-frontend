import { Button, Divider, Form, Grid, List, Loader, Modal, Placeholder } from 'semantic-ui-react';
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { CreateEmployeeAvailabilitiesRequest, CreateScheduleShiftRequest, ScheduleResponse, UserResponse } from '../../api/__generated__';
import { useApi } from '../../api/starskyApiClient';
import { useAuth } from '../AuthProvider';
import { ErrorModal } from './ErrorModal';
import { logAndFormatError } from '../../util/errorHelper';
import dayjs, { Dayjs } from 'dayjs';
import { Simulate } from 'react-dom/test-utils';

interface IShiftsModalProps {
    trigger: React.ReactNode;
    employees: UserResponse[];
    scheduleDates: Dayjs[];
    schedule: ScheduleResponse;
}
export const ShiftsModal: React.FC<IShiftsModalProps> = (props: IShiftsModalProps) => {
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<number[]>([]);
    const [requiredEmployees, setRequiredEmployees] = useState<string>('1');
    const [shifts, setShifts] = useState<{ shiftRequest: CreateScheduleShiftRequest; availabilityRequests: CreateEmployeeAvailabilitiesRequest[] }[]>([]);
    const [errors, setErrors] = useState<{ requiredEmployees: boolean; shiftStart: boolean; shiftEnd: boolean; availableEmployees: boolean }>({
        availableEmployees: false,
        requiredEmployees: false,
        shiftEnd: false,
        shiftStart: false,
    });

    const [apiError, setApiError] = useState<{ occurred: boolean; message: string }>({ occurred: false, message: '' });
    // date range can't be dayjs, react date picker library does not like it
    const [dateRange, setDateRange] = useState<{ startDate: Date | null; endDate: Date | null }>({ startDate: props.scheduleDates[0].toDate(), endDate: null });
    const [startHour, setStartHour] = useState<Dayjs | null>(dayjs().hour(8).minute(0));
    const [endHour, setEndHour] = useState<Dayjs | null>(dayjs().hour(16).minute(0));

    const { token } = useAuth();
    const apis = useApi(token);

    const onModalOpen = () => {
        setModalOpen(true);
        setSelectedEmployeeIds([]);
        setRequiredEmployees('1');
        setShifts([]);
        setStartHour(dayjs().hour(8).minute(0));
        setEndHour(dayjs().hour(16).minute(0));
        setErrors({
            availableEmployees: false,
            requiredEmployees: false,
            shiftEnd: false,
            shiftStart: false,
        });
        setDateRange({ startDate: props.scheduleDates[0].toDate(), endDate: null });
        setApiError({ message: '', occurred: false });
        setLoading(false);
    };

    const addToShifts = (shiftStartUnix: number, shiftEndUnix: number, requiredEmployees: number) => {
        setShifts((previousState) => [
            ...previousState,
            {
                shiftRequest: {
                    shiftStart: shiftStartUnix,
                    shiftEnd: shiftEndUnix,
                    numberOfRequiredEmployees: requiredEmployees,
                },
                availabilityRequests: selectedEmployeeIds.map((id) => {
                    return {
                        employeeId: id,
                        availabilityStart: shiftStartUnix,
                        availabilityEnd: shiftEndUnix,
                        shiftId: -1, //this will get replaced after we create shift
                        maxHoursPerShift: props.schedule.maxHoursPerShift,
                    };
                }),
            },
        ]);
    };

    const onAddShiftClick = () => {
        const employeesNumber = parseInt(requiredEmployees);
        const currentErrors = {
            availableEmployees: selectedEmployeeIds.length == 0,
            requiredEmployees: !employeesNumber,
            shiftEnd: !endHour,
            shiftStart: !startHour,
        };
        setErrors(currentErrors);
        if (
            currentErrors.availableEmployees ||
            currentErrors.requiredEmployees ||
            currentErrors.shiftEnd ||
            currentErrors.shiftStart ||
            !dateRange.startDate ||
            !startHour ||
            !endHour
        ) {
            return;
        }
        if (
            (dateRange.startDate && dateRange.endDate == null) ||
            (dateRange.startDate && dateRange.endDate && dateRange.startDate.getTime() == dateRange.endDate.getTime())
        ) {
            const start = setTimeToDate(dateRange.startDate, startHour).unix();
            const end = setTimeToDate(dateRange.startDate, endHour).unix();
            addToShifts(start, end, employeesNumber);
        } else {
            const startDate = setTimeToDate(dateRange.startDate, startHour);
            const endDate = setTimeToDate(dateRange.endDate!, endHour);

            for (let i = 0; i <= endDate.diff(startDate, 'day'); i++) {
                const currentDate = startDate.add(i, 'day');
                const start = setTimeToDate(currentDate, startHour).unix();
                const end = setTimeToDate(currentDate, endHour).unix();
                addToShifts(start, end, employeesNumber);
            }
        }
    };

    const setTimeToDate = (date: Dayjs | Date, time: Dayjs) => {
        if (date instanceof Date) {
            return dayjs(date).hour(time.hour()).minute(time.minute()).second(time.second()).millisecond(time.millisecond());
        } else {
            return date.hour(time.hour()).minute(time.minute()).second(time.second()).millisecond(time.millisecond());
        }
    };

    const getInlineDatePicker = () => (
        <DatePicker
            selectsRange
            selected={dateRange.startDate}
            startDate={dateRange.startDate}
            endDate={dateRange.endDate}
            onChange={(update: [Date, Date]) => setDateRange({ startDate: update[0], endDate: update[1] })}
            inline
            includeDates={props.scheduleDates.map((value) => value.toDate())}
            allowSameDay
            calendarStartDay={1}
        />
    );

    const getRequiredEmployeesInput = () => (
        <Form.Input
            labelPosition="left"
            label="Number of required employees per shift:"
            required
            min={1}
            placeholder="3"
            icon="users"
            iconPosition="left"
            type="number"
            value={requiredEmployees}
            onChange={(event, data) => {
                setRequiredEmployees(data.value);
            }}
            error={errors.requiredEmployees}
        />
    );

    const getAvailableEmployeesDropdown = () => (
        <Form.Dropdown
            floating
            labeled
            placeholder="Select employees"
            search
            label="Available employees:"
            required
            error={errors.availableEmployees}
            selection
            options={props.employees.map((employee) => {
                return { text: employee.name, key: employee.id, value: employee.id, icon: 'user' };
            })}
            multiple
            onChange={(event, data) => setSelectedEmployeeIds(data.value as number[])}
        />
    );

    const getStartTimePicker = () => (
        <>
            <Form.Field label="Shift start:" required style={{ marginBottom: 0 }} error={errors.shiftStart} />
            <DatePicker
                selected={startHour?.toDate()}
                onChange={(date: Date | null) => {
                    if (!date) {
                        setStartHour(null);
                    } else {
                        setStartHour(dayjs(date));
                    }
                }}
                placeholderText="Click to select shift start"
                required
                wrapperClassName="datePicker"
                dateFormat="HH:mm"
                timeFormat="HH:mm"
                showTimeSelect
                showTimeSelectOnly
            />
        </>
    );

    const getEndTimePicker = () => (
        <>
            <Form.Field label="Shift end:" required style={{ marginBottom: 0 }} error={errors.shiftEnd} />
            <DatePicker
                selected={endHour?.toDate()}
                onChange={(date: Date | null) => {
                    if (!date) {
                        setEndHour(null);
                    } else {
                        setEndHour(dayjs(date));
                    }
                }}
                placeholderText="Click to select shift end"
                required
                wrapperClassName="datePicker"
                dateFormat="HH:mm"
                timeFormat="HH:mm"
                showTimeSelect
                showTimeSelectOnly
            />
        </>
    );

    const mainModalForm = () => (
        <Form className={`right-margin`}>
            <Grid>
                <Grid.Column width={12} mobile={16}>
                    <Grid columns={'equal'}>
                        <Grid.Column>{getStartTimePicker()}</Grid.Column>
                        <Grid.Column>{getEndTimePicker()}</Grid.Column>
                    </Grid>
                    {getRequiredEmployeesInput()}
                    {getAvailableEmployeesDropdown()}
                </Grid.Column>
                <Grid.Column width={4} mobile={16}>
                    {getInlineDatePicker()}
                </Grid.Column>
            </Grid>
        </Form>
    );

    const getShiftsList = () => (
        <List bulleted>
            {shifts.map((value, index) => {
                return (
                    <List.Item key={value.shiftRequest.shiftStart + index}>
                        {dayjs.unix(value.shiftRequest.shiftStart).format('ddd, MMM DD: H:mm')} - {dayjs.unix(value.shiftRequest.shiftEnd).format('H:mm')} -{' '}
                        {value.shiftRequest.numberOfRequiredEmployees} employee(s)
                    </List.Item>
                );
            })}
        </List>
    );

    const onOkClick = async () => {
        setLoading(true);

        const scheduleShifts = await apis.scheduleShiftApi
            .putScheduleShifts({
                scheduleId: props.schedule.id,
                createScheduleShiftRequest: shifts.map((shift) => shift.shiftRequest),
            })
            .catch((reason) => {
                setApiError({ message: logAndFormatError(reason), occurred: true });
            });

        if (!scheduleShifts) {
            setLoading(false);
            return;
        }

        const employeeAvailabilities = [];
        for (const scheduleShift of scheduleShifts) {
            const requests = shifts.find(
                (value) => value.shiftRequest.shiftStart == scheduleShift.shiftStart && value.shiftRequest.shiftEnd == scheduleShift.shiftEnd,
            )?.availabilityRequests;
            if (requests) {
                for (const request of requests) {
                    request.shiftId = scheduleShift.id;
                    employeeAvailabilities.push(request);
                }
            }
        }

        await apis.employeeAvailabilityApi
            .putEmployeeAvailabilities({ createEmployeeAvailabilitiesRequest: employeeAvailabilities })
            .catch((reason) => {
                setApiError({ message: logAndFormatError(reason), occurred: true });
            })
            .finally(() => setModalOpen(false));
    };

    return (
        <Modal open={modalOpen} onOpen={onModalOpen} onClose={() => setModalOpen(false)} trigger={props.trigger}>
            <Modal.Header>Create new shift(s)</Modal.Header>
            <Modal.Content>{mainModalForm()}</Modal.Content>
            <Divider className="no-top-bottom-margin" />
            <Modal.Content>{getShiftsList()}</Modal.Content>
            <Modal.Actions>
                <Button icon="plus" content="Add shift(s)" type="submit" onClick={onAddShiftClick} primary disabled={loading} />
                <Button icon="checkmark" content="OK" onClick={onOkClick} loading={loading} positive disabled={shifts.length == 0} />
            </Modal.Actions>
            {apiError.occurred ? <ErrorModal errorMessage={apiError.message} /> : null}
        </Modal>
    );
};
