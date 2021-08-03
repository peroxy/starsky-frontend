import React, { useState } from 'react';
import { Button, Header, Icon, Modal } from 'semantic-ui-react';

export interface IConfirmActionModalProps {
    title: string;
    message: string;
    icon: React.ReactNode;
    onConfirm: () => void;
    trigger: React.ReactNode;
}

export const ConfirmActionModal: React.FC<IConfirmActionModalProps> = (props: IConfirmActionModalProps) => {
    const [open, setOpen] = useState(false);

    return (
        <Modal basic onClose={() => setOpen(false)} onOpen={() => setOpen(true)} open={open} size="small" trigger={props.trigger}>
            <Header icon>
                {props.icon}
                {props.title}
            </Header>
            <Modal.Content style={{ textAlign: 'center' }}>
                {props.message.split('\n').map((split, index) => (
                    <p key={`cam-line${index}`}>{split}</p>
                ))}
            </Modal.Content>
            <Modal.Actions style={{ textAlign: 'center' }}>
                <Button
                    basic
                    color="red"
                    inverted
                    onClick={() => {
                        setOpen(false);
                    }}
                >
                    <Icon name="remove" /> No
                </Button>
                <Button
                    color="green"
                    inverted
                    onClick={() => {
                        setOpen(false);
                        props.onConfirm();
                    }}
                >
                    <Icon name="checkmark" /> Yes
                </Button>
            </Modal.Actions>
        </Modal>
    );
};
