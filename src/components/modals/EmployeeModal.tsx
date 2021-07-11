import React, { useState } from 'react';
import { Button, Form, Icon, Modal } from 'semantic-ui-react';
import { ConfirmActionModal } from './ConfirmActionModal';
import { UserResponse } from '../../api/__generated__';
import { HttpStatusCode } from '../../api/httpHelpers';

interface IEmployeeModalProps {
    employee?: UserResponse;
    modalHeader: string;
    modalOkButtonText: string;
    trigger: React.ReactNode;
    onOkButtonClick: (name: string, jobTitle: string, email: string, id?: number) => Promise<void>;
    onDeleteButtonClick?: (employee: UserResponse) => Promise<void>;
}

export const EmployeeModal: React.FC<IEmployeeModalProps> = (props: IEmployeeModalProps) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [errorOccurred, setErrorOccurred] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>('');

    const formName = 'formEmployee';
    const formEmployeeName = 'formEmployeeName';
    const formEmployeeJobTitle = 'formEmployeeJobTitle';
    const formEmployeeEmail = 'formEmployeeEmail';

    const handleOnCloseModal = async () => {
        setModalOpen(false);
    };

    const handleOnSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        setErrorOccurred(false);

        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const employeeName = formData.get(formEmployeeName) as string;
        const jobTitle = formData.get(formEmployeeJobTitle) as string;
        const email = formData.get(formEmployeeEmail) as string;

        await props
            .onOkButtonClick(employeeName, jobTitle, email, props.employee?.id)
            .then(() => {
                setModalOpen(false);
            })
            .catch((reason) => {
                console.error(reason);
                if (reason instanceof Response && reason.status == HttpStatusCode.CONFLICT) {
                    setErrorMessage(`Email ${email} already exists. Please choose another email.`);
                } else {
                    setErrorMessage(`An unexpected error occurred. Please try again later.`);
                }
                setErrorOccurred(true);
            });
    };

    const handleOnDeleteConfirmation = async (confirmed: boolean) => {
        if (confirmed) {
            setErrorOccurred(false);

            await props
                .onDeleteButtonClick?.(props.employee as UserResponse)
                .then(() => {
                    setModalOpen(false);
                })
                .catch((reason) => {
                    setErrorMessage(`An unexpected error occurred. Please try again later. [Error description: ${reason}]`);
                    setErrorOccurred(true);
                    console.error(reason);
                });
        }
    };

    return (
        <Modal onClose={handleOnCloseModal} onOpen={() => setModalOpen(true)} open={modalOpen} closeIcon trigger={props.trigger}>
            <Modal.Header>{props.modalHeader}</Modal.Header>
            <Modal.Content>
                <Modal.Description>
                    <Form onSubmit={handleOnSubmit} id={formName}>
                        <Form.Input
                            labelPosition={'left'}
                            label={'Employee name:'}
                            fluid
                            placeholder={'David Starsky'}
                            icon={'user'}
                            iconPosition={'left'}
                            defaultValue={props.employee?.name}
                            name={formEmployeeName}
                            required
                            minLength={1}
                        />
                        <Form.Input
                            labelPosition={'left'}
                            label={'Email:'}
                            fluid
                            placeholder={'david@starsky.net'}
                            icon={'mail'}
                            iconPosition={'left'}
                            defaultValue={props.employee?.email}
                            name={formEmployeeEmail}
                            required
                            type={'email'}
                        />
                        <Form.Input
                            labelPosition={'left'}
                            label={'Job title:'}
                            fluid
                            placeholder={'Police Detective'}
                            icon={'briefcase'}
                            iconPosition={'left'}
                            defaultValue={props.employee?.jobTitle}
                            name={formEmployeeJobTitle}
                            required
                            minLength={1}
                            maxLength={128}
                        />
                    </Form>
                </Modal.Description>
            </Modal.Content>
            <Modal.Actions>
                {props.onDeleteButtonClick ? (
                    <ConfirmActionModal
                        title={'Delete This Employee'}
                        message={`Are you sure you would like to delete employee: '${props.employee?.name}'?\nThis action is permanent and cannot be undone!`}
                        icon={<Icon name="trash" />}
                        onConfirm={handleOnDeleteConfirmation}
                        trigger={<Button icon="trash" negative content="Delete" labelPosition="left" className="float-left" />}
                    />
                ) : undefined}
                <Button content={props.modalOkButtonText} icon="checkmark" type="submit" positive form={formName} labelPosition="left" />
            </Modal.Actions>

            <Modal onClose={() => setErrorOccurred(false)} open={errorOccurred} size="tiny">
                <Modal.Header>Error occurred</Modal.Header>
                <Modal.Content>
                    <p>{errorMessage}</p>
                </Modal.Content>
                <Modal.Actions>
                    <Button icon="warning sign" content="OK" onClick={() => setErrorOccurred(false)} negative />
                </Modal.Actions>
            </Modal>
        </Modal>
    );
};
