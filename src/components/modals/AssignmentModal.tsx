import React, { useState } from 'react';
import { Button, Checkbox, Divider, Form, Header, Icon, List, Modal, Segment } from 'semantic-ui-react';
import { ScheduleShiftResponse } from '../../api/__generated__';
import { shiftToString } from '../../util/dateHelper';

export interface AssignmentModalProps {
    onConfirmation: (selectedShifts: ScheduleShiftResponse[]) => void;
    trigger: React.ReactNode;
    shifts: ScheduleShiftResponse[];
}

export const AssignmentModal: React.FC<AssignmentModalProps> = (props: AssignmentModalProps) => {
    const [open, setOpen] = useState(false);
    const [selectAllChecked, setSelectAllChecked] = useState(props.shifts.length == 1);
    const [checkedShifts, setCheckedShifts] = useState<ScheduleShiftResponse[]>(props.shifts.length == 1 ? props.shifts : []);

    return (
        <Modal onClose={() => setOpen(false)} onOpen={() => setOpen(true)} open={open} trigger={props.trigger} size="mini">
            <Header icon="tasks" content="Assign employee to shift(s)" />
            <Modal.Content>
                <List divided relaxed size="big" selection>
                    <List.Item
                        onClick={() => {
                            if (!selectAllChecked) {
                                setCheckedShifts(props.shifts);
                            } else {
                                setCheckedShifts([]);
                            }
                            setSelectAllChecked(!selectAllChecked);
                        }}
                    >
                        <b>
                            <Checkbox label={'Select all'} className="full-width" checked={selectAllChecked} />
                        </b>
                    </List.Item>
                    {props.shifts
                        .sort((a, b) => a.shiftStart - b.shiftStart)
                        .map((shift, i) => {
                            return (
                                <List.Item
                                    key={`shift-cbox-${i}-${shift.id}`}
                                    onClick={() => {
                                        if (checkedShifts.some((checkedShift) => checkedShift.id == shift.id)) {
                                            setCheckedShifts(checkedShifts.filter((scheduleShift) => scheduleShift.id != shift.id));
                                        } else {
                                            setCheckedShifts((previousState) => [...previousState, shift]);
                                        }
                                    }}
                                >
                                    <Checkbox
                                        label={shiftToString(shift)}
                                        className="full-width"
                                        checked={checkedShifts.some((value) => value.id == shift.id)}
                                    />
                                </List.Item>
                            );
                        })}
                </List>
            </Modal.Content>
            <Modal.Actions>
                <Button color="red" onClick={() => setOpen(false)} floated="left" icon="remove" content="Cancel" />
                <Button
                    color="green"
                    onClick={() => {
                        setOpen(false);
                        props.onConfirmation(checkedShifts);
                    }}
                    floated="right"
                    content="Confirm"
                    icon="check"
                    disabled={checkedShifts.length == 0}
                />
                <Divider className="invisible" />
            </Modal.Actions>
        </Modal>
    );
};
