import { EmployeeAssignmentResponse, ScheduleResponse, ScheduleShiftResponse } from '../../api/__generated__';
import React, { useState } from 'react';
import { Button, Divider, Form, Grid, Header, Icon, Modal } from 'semantic-ui-react';
import DatePicker from 'react-datepicker';
import dayjs, { Dayjs } from 'dayjs';
import { useAuth } from '../AuthProvider';
import { useApi } from '../../api/starskyApiClient';
import { ConfirmActionModal } from './ConfirmActionModal';
import { ErrorModal } from './ErrorModal';
import { ErrorDetails, getErrorDetails, getErrorNotOccurred } from '../../util/errorHelper';

export interface EditAssignmentModalProps {
    onAssignmentUpdate: (updatedAssignment: EmployeeAssignmentResponse) => void;
    onAssignmentDelete: (deletedAssignment: EmployeeAssignmentResponse) => void;
    trigger: React.ReactNode;
    assignment: EmployeeAssignmentResponse;
    schedule: ScheduleResponse;
    shift: ScheduleShiftResponse;
}

export const EditAssignmentModal: React.FC<EditAssignmentModalProps> = (props: EditAssignmentModalProps) => {
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [startHour, setStartHour] = useState<Dayjs | null>(dayjs.unix(props.assignment.assignmentStart));
    const [endHour, setEndHour] = useState<Dayjs | null>(dayjs.unix(props.assignment.assignmentEnd));
    const [apiError, setApiError] = useState<ErrorDetails>(getErrorNotOccurred());
    const [errors, setErrors] = useState<{ startHour: boolean; endHour: boolean }>({
        endHour: false,
        startHour: false,
    });
    const { token } = useAuth();
    const apis = useApi(token);

    const getTimePickerStartHour = () => {
        return (
            <>
                <Form.Field label="Shift start:" required style={{ marginBottom: 0 }} error={errors.startHour} />
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
                    minTime={dayjs.unix(props.shift.shiftStart).toDate()}
                    maxTime={dayjs.unix(props.shift.shiftEnd).toDate()}
                />
            </>
        );
    };

    const getTimePickerEndHour = () => (
        <>
            <Form.Field label="Shift end:" required style={{ marginBottom: 0 }} error={errors.endHour} />
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
                minTime={dayjs.unix(props.shift.shiftStart).toDate()}
                maxTime={dayjs.unix(props.shift.shiftEnd).toDate()}
            />
        </>
    );

    const onModalOpen = () => {
        setStartHour(dayjs.unix(props.assignment.assignmentStart));
        setEndHour(dayjs.unix(props.assignment.assignmentEnd));
        setApiError(getErrorNotOccurred());
        setErrors({ endHour: false, startHour: false });
        setOpen(true);
        setLoading(false);
    };

    const onAssignmentSave = () => {
        if (!startHour || !endHour) {
            setErrors({ startHour: !startHour, endHour: !endHour });
            return;
        }
        setLoading(true);

        apis.employeeAssignmentApi
            .patchEmployeeAssignment({
                assignmentId: props.assignment.id!,
                scheduleId: props.schedule.id,
                updateEmployeeAssignmentRequest: { assignmentStart: startHour.unix(), assignmentEnd: endHour.unix() },
            })
            .then((response) => {
                setOpen(false);
                props.onAssignmentUpdate(response);
            })
            .catch(async (reason) => {
                setApiError(await getErrorDetails(reason));
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const onAssignmentDelete = () => {
        setLoading(true);
        apis.employeeAssignmentApi
            .deleteEmployeeAssignment({ assignmentId: props.assignment.id!, scheduleId: props.schedule.id })
            .then(() => {
                setOpen(false);
                props.onAssignmentDelete(props.assignment);
            })
            .catch(async (reason) => {
                setApiError(await getErrorDetails(reason));
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <Modal onClose={() => setOpen(false)} onOpen={onModalOpen} open={open} trigger={props.trigger} size="small">
            <Header icon="tasks" content="Edit employee assignment" />
            <Modal.Content>
                <Form loading={loading}>
                    <Grid columns={'equal'}>
                        <Grid.Column>{getTimePickerStartHour()}</Grid.Column>
                        <Grid.Column>{getTimePickerEndHour()}</Grid.Column>
                    </Grid>
                </Form>
            </Modal.Content>
            <Modal.Actions>
                <ConfirmActionModal
                    title="Delete shift"
                    message="Are you sure you would like to delete this employee assignment?"
                    icon={<Icon name="trash alternate" />}
                    onConfirm={onAssignmentDelete}
                    trigger={<Button icon="trash" content="Delete" negative disabled={loading} floated="left" />}
                />
                <Button color="green" onClick={onAssignmentSave} floated="right" content="Save" icon="check" disabled={loading} />
                <Divider className="invisible" />
            </Modal.Actions>
            {apiError.occurred ? <ErrorModal error={apiError} onOkClick={() => setApiError(getErrorNotOccurred())} /> : null}
        </Modal>
    );
};
