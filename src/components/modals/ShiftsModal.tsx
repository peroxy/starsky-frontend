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
    const [showAvailableEmployeesError, setShowAvailableEmployeesError] = useState(false);
    const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<number[]>([]);
    const [requiredEmployees, setRequiredEmployees] = useState<number>();
    const [shifts, setShifts] = useState<{ shiftRequest: CreateScheduleShiftRequest; assignmentRequest: PutEmployeeAssignmentRequest }[]>([]);
    const [assignments, setAssignments] = useState<CreateEmployeeAssignmentRequest[]>([]);

    // date range can't be dayjs, react date picker library does not like it
    const [dateRange, setDateRange] = useState<{ startDate: Date | null; endDate: Date | null }>({ startDate: props.scheduleDates[0].toDate(), endDate: null });
    const [startHour, setStartHour] = useState(dayjs().hour(8).minute(0));
    const [endHour, setEndHour] = useState(dayjs().hour(16).minute(0));

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    };

    return (
        <Modal open={modalOpen} onOpen={() => setModalOpen(true)} onClose={() => setModalOpen(false)} trigger={props.trigger}>
            <Modal.Header>Create new shift(s)</Modal.Header>
            <Modal.Content>
                <Form onSubmit={onSubmit} className="right-margin">
                    <Grid>
                        <Grid.Column width={12}>
                            <Grid columns={'equal'}>
                                <Grid.Column>
                                    <Form.Field label="Shift start:" required style={{ marginBottom: 0 }} />
                                    <DatePicker
                                        selected={startHour.toDate()}
                                        onChange={(date: Date) => setStartHour(dayjs(date))}
                                        placeholderText="Click to select shift start"
                                        required
                                        wrapperClassName="datePicker"
                                        dateFormat="HH:mm"
                                        timeFormat="HH:mm"
                                        showTimeSelect
                                        showTimeSelectOnly
                                    />
                                </Grid.Column>
                                <Grid.Column>
                                    <Form.Field label="Shift end:" required style={{ marginBottom: 0 }} />
                                    <DatePicker
                                        selected={endHour.toDate()}
                                        onChange={(date: Date) => setEndHour(dayjs(date))}
                                        placeholderText="Click to select shift end"
                                        required
                                        wrapperClassName="datePicker"
                                        dateFormat="HH:mm"
                                        timeFormat="HH:mm"
                                        showTimeSelect
                                        showTimeSelectOnly
                                    />
                                </Grid.Column>
                            </Grid>

                            <Form.Input
                                labelPosition="left"
                                label="Number of required employees per shift:"
                                required
                                min={1}
                                placeholder="3"
                                icon="users"
                                iconPosition="left"
                                type="number"
                                onChange={(event, data) => setRequiredEmployees(parseInt(data.value))}
                            />
                            <Form.Dropdown
                                floating
                                labeled
                                placeholder="Select employees"
                                search
                                label="Available employees:"
                                required
                                error={showAvailableEmployeesError}
                                selection
                                options={props.employees.map((employee) => {
                                    return { text: employee.name, key: employee.id, value: employee.id, icon: 'user' };
                                })}
                                multiple
                                onChange={(event, data) => setSelectedEmployeeIds(data.value as number[])}
                            />
                        </Grid.Column>
                        <Grid.Column width={4}>
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
                        </Grid.Column>
                    </Grid>
                </Form>
            </Modal.Content>
            <Divider />
            <Modal.Content>
                Shifts to create:
                <List bulleted>
                    {shifts.map((value, index) => {
                        return (
                            <List.Item key={index}>
                                {dayjs.unix(value.shiftRequest.shiftStart).format('ddd, MMM DD: H:mm')} -{' '}
                                {dayjs.unix(value.shiftRequest.shiftEnd).format('H:mm')}
                            </List.Item>
                        );
                    })}
                </List>
            </Modal.Content>
            <Modal.Actions>
                <Button
                    icon="plus"
                    content="Add shift(s)"
                    type="submit"
                    onClick={() => {
                        if (
                            (dateRange.startDate && dateRange.endDate == null) ||
                            (dateRange.startDate && dateRange.endDate && dateRange.startDate == dateRange.endDate)
                        ) {
                            setShifts((previousState) => [
                                ...previousState,
                                {
                                    shiftRequest: {
                                        shiftStart: startHour.date(dateRange.startDate!.getDate()).unix(),
                                        shiftEnd: endHour.date(dateRange.startDate!.getDate()).unix(),
                                        numberOfRequiredEmployees: requiredEmployees!,
                                    },
                                    assignmentRequest: { scheduleId: 1, createEmployeeAssignmentRequest: [] },
                                },
                            ]);
                        }
                    }}
                    primary
                />
                <Button icon="checkmark" content="OK" onClick={() => setModalOpen(false)} positive disabled={shifts.length == 0} />
            </Modal.Actions>
        </Modal>
    );
};
