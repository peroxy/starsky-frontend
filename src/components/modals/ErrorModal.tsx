import { Button, Modal, StrictModalProps } from 'semantic-ui-react';
import React, { useState } from 'react';

interface IErrorModalProps {
    errorMessage: string;
    size?: 'mini' | 'tiny' | 'small' | 'large' | 'fullscreen';
    // onOkClick: () => void;
}
export const ErrorModal: React.FC<IErrorModalProps> = (props: IErrorModalProps) => {
    const [modalOpen, setModalOpen] = useState(true);
    return (
        <Modal open={modalOpen} size={props.size ? props.size : 'tiny'} onClose={() => setModalOpen(false)}>
            <Modal.Header>Error occurred</Modal.Header>
            <Modal.Content>
                <p>{props.errorMessage}</p>
            </Modal.Content>
            <Modal.Actions>
                <Button icon="warning sign" content="OK" onClick={() => setModalOpen(false)} negative />
            </Modal.Actions>
        </Modal>
    );
};
