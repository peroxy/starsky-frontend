import { Button, Divider, Form, FormInput, Grid, GridColumn, List, ListItem, Modal } from 'semantic-ui-react';
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { CreateEmployeeAssignmentRequest, CreateScheduleShiftRequest, PutEmployeeAssignmentRequest, UserResponse } from '../../api/__generated__';
import dayjs, { Dayjs } from 'dayjs';

interface IShiftsModalProps {
    trigger: React.ReactNode;
    employees: UserResponse[];
    scheduleDates: Dayjs[];
}
export const ShiftsModal: React.FC<IShiftsModalProps> = (props: IShiftsModalProps) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<number[]>([]);
    const [requiredEmployees, setRequiredEmployees] = useState<string>('1');
    const [shifts, setShifts] = useState<{ shiftRequest: CreateScheduleShiftRequest; assignmentRequest: PutEmployeeAssignmentRequest }[]>([]);
    const [assignments, setAssignments] = useState<CreateEmployeeAssignmentRequest[]>([]);
    const [errors, setErrors] = useState<{ requiredEmployees: boolean; shiftStart: boolean; shiftEnd: boolean; availableEmployees: boolean }>({
        availableEmployees: false,
        requiredEmployees: false,
        shiftEnd: false,
        shiftStart: false,
    });
    // date range can't be dayjs, react date picker library does not like it
    const [dateRange, setDateRange] = useState<{ startDate: Date | null; endDate: Date | null }>({ startDate: props.scheduleDates[0].toDate(), endDate: null });
    const [startHour, setStartHour] = useState<Dayjs | null>(dayjs().hour(8).minute(0));
    const [endHour, setEndHour] = useState<Dayjs | null>(dayjs().hour(16).minute(0));

    const onModalOpen = () => {
        setModalOpen(true);
        setSelectedEmployeeIds([]);
        setRequiredEmployees('1');
        setShifts([]);
        setAssignments([]);
        setStartHour(dayjs().hour(8).minute(0));
        setEndHour(dayjs().hour(16).minute(0));
        setErrors({
            availableEmployees: false,
            requiredEmployees: false,
            shiftEnd: false,
            shiftStart: false,
        });
        setDateRange({ startDate: props.scheduleDates[0].toDate(), endDate: null });
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
        if (currentErrors.availableEmployees || currentErrors.requiredEmployees || currentErrors.shiftEnd || currentErrors.shiftStart) {
            return;
        }
        if (
            (dateRange.startDate && dateRange.endDate == null) ||
            (dateRange.startDate && dateRange.endDate && dateRange.startDate.getTime() == dateRange.endDate.getTime())
        ) {
            setShifts((previousState) => [
                ...previousState,
                {
                    shiftRequest: {
                        shiftStart: startHour!.date(dateRange.startDate!.getDate()).unix(),
                        shiftEnd: endHour!.date(dateRange.startDate!.getDate()).unix(),
                        numberOfRequiredEmployees: parseInt(requiredEmployees),
                    },
                    assignmentRequest: { scheduleId: 1, createEmployeeAssignmentRequest: [] },
                },
            ]);
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
        <Form className="right-margin">
            <Grid>
                <Grid.Column width={12}>
                    <Grid columns={'equal'}>
                        <Grid.Column>{getStartTimePicker()}</Grid.Column>
                        <Grid.Column>{getEndTimePicker()}</Grid.Column>
                    </Grid>
                    {getRequiredEmployeesInput()}
                    {getAvailableEmployeesDropdown()}
                </Grid.Column>
                <Grid.Column width={4}>{getInlineDatePicker()}</Grid.Column>
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

    return (
        <Modal open={modalOpen} onOpen={onModalOpen} onClose={() => setModalOpen(false)} trigger={props.trigger}>
            <Modal.Header>Create new shift(s)</Modal.Header>
            <Modal.Content>{mainModalForm()}</Modal.Content>
            <Divider />
            <Modal.Content>
                Shifts to create:
                {getShiftsList()}
            </Modal.Content>
            <Modal.Actions>
                <Button icon="plus" content="Add shift(s)" type="submit" onClick={onAddShiftClick} primary />
                <Button icon="checkmark" content="OK" onClick={() => setModalOpen(false)} positive disabled={shifts.length == 0} />
            </Modal.Actions>
        </Modal>
    );
};
