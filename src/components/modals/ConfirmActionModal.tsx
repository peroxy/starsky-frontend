import React, { useState } from 'react';
import { Button, Header, Icon, Modal } from 'semantic-ui-react';

export interface IConfirmActionModalProps {
    title: string;
    message: string;
    icon: React.ReactNode;
    onConfirm: (confirmed: boolean) => void;
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
            <Modal.Content>
                <p>{props.message}</p>
            </Modal.Content>
            <Modal.Actions>
                <Button
                    basic
                    color="red"
                    inverted
                    onClick={() => {
                        setOpen(false);
                        props.onConfirm(false);
                    }}
                >
                    <Icon name="remove" /> No
                </Button>
                <Button
                    color="green"
                    inverted
                    onClick={() => {
                        setOpen(false);
                        props.onConfirm(true);
                    }}
                >
                    <Icon name="checkmark" /> Yes
                </Button>
            </Modal.Actions>
        </Modal>
    );
};
