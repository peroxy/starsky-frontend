import { Button, Form, Grid, Icon, Modal } from 'semantic-ui-react';
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
    CreateEmployeeAvailabilitiesRequest,
    EmployeeAvailabilityResponse,
    ScheduleResponse,
    ScheduleShiftResponse,
    UserResponse,
} from '../../api/__generated__';
import { useApi } from '../../api/starskyApiClient';
import { useAuth } from '../AuthProvider';
import { ErrorModal } from './ErrorModal';
import { logAndFormatError } from '../../util/errorHelper';
import dayjs, { Dayjs } from 'dayjs';
import { ConfirmActionModal } from './ConfirmActionModal';

interface EditShiftModalProps {
    trigger: React.ReactNode;
    shift: ScheduleShiftResponse;
    availabilities: EmployeeAvailabilityResponse[];
    employees: UserResponse[];
    schedule: ScheduleResponse;
    onShiftEdited: (shift: ScheduleShiftResponse) => void;
    onShiftDeleted: (shiftId: number) => void;
}
export const EditShiftModal: React.FC<EditShiftModalProps> = (props: EditShiftModalProps) => {
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<number[]>(props.availabilities.map((availability) => availability.employeeId));
    const [requiredEmployees, setRequiredEmployees] = useState<string>(props.shift.numberOfRequiredEmployees.toString());
    const [errors, setErrors] = useState<{ requiredEmployees: boolean; shiftStart: boolean; shiftEnd: boolean; availableEmployees: boolean }>({
        availableEmployees: false,
        requiredEmployees: false,
        shiftEnd: false,
        shiftStart: false,
    });

    const [apiError, setApiError] = useState<{ occurred: boolean; message: string }>({ occurred: false, message: '' });
    const [startHour, setStartHour] = useState<Dayjs | null>(dayjs.unix(props.shift.shiftStart));
    const [endHour, setEndHour] = useState<Dayjs | null>(dayjs.unix(props.shift.shiftEnd));

    const { token } = useAuth();
    const apis = useApi(token);

    const onModalOpen = () => {
        setModalOpen(true);
        setSelectedEmployeeIds(props.availabilities.map((availability) => availability.employeeId));
        setRequiredEmployees(props.shift.numberOfRequiredEmployees.toString());
        setStartHour(dayjs.unix(props.shift.shiftStart));
        setEndHour(dayjs.unix(props.shift.shiftEnd));
        setErrors({
            availableEmployees: false,
            requiredEmployees: false,
            shiftEnd: false,
            shiftStart: false,
        });
        setApiError({ message: '', occurred: false });
        setLoading(false);
    };

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
            defaultValue={selectedEmployeeIds}
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
        <Form className={`right-margin`} loading={loading}>
            <Grid columns={'equal'}>
                <Grid.Column>{getStartTimePicker()}</Grid.Column>
                <Grid.Column>{getEndTimePicker()}</Grid.Column>
            </Grid>
            {getRequiredEmployeesInput()}
            {getAvailableEmployeesDropdown()}
        </Form>
    );

    const onOkClick = async () => {
        setLoading(true);

        const employeesNumber = parseInt(requiredEmployees);
        const currentErrors = {
            availableEmployees: selectedEmployeeIds.length == 0,
            requiredEmployees: !employeesNumber,
            shiftEnd: !endHour,
            shiftStart: !startHour,
        };
        setErrors(currentErrors);
        if (currentErrors.availableEmployees || currentErrors.requiredEmployees || currentErrors.shiftEnd || currentErrors.shiftStart) {
            setLoading(false);
            return;
        }

        await apis.scheduleShiftApi
            .patchScheduleShift({
                shiftId: props.shift.id,
                updateScheduleShiftRequest: {
                    shiftStart: startHour!.unix(),
                    shiftEnd: endHour!.unix(),
                    numberOfRequiredEmployees: parseInt(requiredEmployees),
                },
            })
            .then(async (value) => {
                await apis.employeeAvailabilityApi
                    .putEmployeeAvailabilities({
                        createEmployeeAvailabilitiesRequest: selectedEmployeeIds.map((x): CreateEmployeeAvailabilitiesRequest => {
                            return {
                                employeeId: x,
                                availabilityStart: startHour!.unix(),
                                shiftId: props.shift.id,
                                availabilityEnd: endHour!.unix(),
                                maxHoursPerShift: 8,
                            };
                        }),
                    })
                    .catch((reason) => setApiError({ message: logAndFormatError(reason), occurred: true }))
                    .finally(() => {
                        setModalOpen(false);
                        props.onShiftEdited(value);
                    });
            })
            .catch((reason) => {
                setApiError({ message: logAndFormatError(reason), occurred: true });
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const onShiftDelete = () => {
        setLoading(true);
        apis.scheduleShiftApi
            .deleteScheduleShift({ shiftId: props.shift.id })
            .then(() => {
                setModalOpen(false);
                props.onShiftDeleted(props.shift.id);
            })
            .catch((reason) => {
                setApiError({ message: logAndFormatError(reason), occurred: true });
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <Modal open={modalOpen} onOpen={onModalOpen} onClose={() => setModalOpen(false)} trigger={props.trigger} closeIcon>
            <Modal.Header>Edit shift</Modal.Header>
            <Modal.Content>{mainModalForm()}</Modal.Content>
            <Modal.Actions>
                <ConfirmActionModal
                    title={'Delete shift'}
                    message={'Would you like to delete this shift? Please note that this will also delete any employee availability/assignment.'}
                    icon={<Icon name={'trash alternate'} />}
                    onConfirm={onShiftDelete}
                    trigger={<Button icon="trash" content="Delete" negative disabled={loading} floated="left" />}
                />
                <Button icon="checkmark" content="OK" onClick={onOkClick} loading={loading} positive />
            </Modal.Actions>
            {apiError.occurred ? <ErrorModal errorMessage={apiError.message} /> : null}
        </Modal>
    );
};
