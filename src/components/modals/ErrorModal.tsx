import { Accordion, Button, Modal } from 'semantic-ui-react';
import React, { useState } from 'react';
import { ErrorDetails } from '../../util/errorHelper';

interface IErrorModalProps {
    error: ErrorDetails;
    size?: 'mini' | 'tiny' | 'small' | 'large' | 'fullscreen';
    onOkClick: () => void;
}
export const ErrorModal: React.FC<IErrorModalProps> = (props: IErrorModalProps) => {
    const [modalOpen, setModalOpen] = useState(true);
    const [expandDetails, setExpandDetails] = useState(false);
    return (
        <Modal open={modalOpen} size={props.size ? props.size : 'tiny'} onClose={() => setModalOpen(false)}>
            <Modal.Header>Error occurred</Modal.Header>
            <Modal.Content>
                <p>{props.error.mainError}</p>
                <Accordion styled>
                    <Accordion.Title onClick={() => setExpandDetails(!expandDetails)}>Show error details...</Accordion.Title>
                    <Accordion.Content active={expandDetails}>
                        <pre>
                            <b>{props.error.status}</b>
                        </pre>
                        <pre>{props.error.details}</pre>
                    </Accordion.Content>
                </Accordion>
            </Modal.Content>
            <Modal.Actions>
                <Button
                    icon="warning sign"
                    content="OK"
                    onClick={() => {
                        setModalOpen(false);
                        props.onOkClick();
                    }}
                    negative
                />
            </Modal.Actions>
        </Modal>
    );
};
