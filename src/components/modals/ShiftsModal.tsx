import { Button, Modal } from 'semantic-ui-react';
import React, { useState } from 'react';

interface IShiftsModalProps {
    trigger: React.ReactNode;
}
export const ShiftsModal: React.FC<IShiftsModalProps> = (props: IShiftsModalProps) => {
    const [modalOpen, setModalOpen] = useState(false);

    return (
        <Modal open={modalOpen} onOpen={() => setModalOpen(true)} onClose={() => setModalOpen(false)} trigger={props.trigger}>
            <Modal.Header>Create new shift(s)</Modal.Header>
            <Modal.Content>
                {/*    TIME PICKER*/}
                {/*    CHECKMARK ON WHICH DAYS?*/}
                {/*    REQUIRED EMPLOYEES?*/}
            </Modal.Content>
            <Modal.Actions>
                <Button icon="checkmark" content="OK" onClick={() => setModalOpen(false)} positive />
            </Modal.Actions>
        </Modal>
    );
};
