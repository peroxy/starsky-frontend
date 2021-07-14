import React, { ReactNode, useState } from 'react';
import { Button, Dimmer, Divider, Form, FormField, FormTextArea, Icon, Modal } from 'semantic-ui-react';
import { ConfirmActionModal } from './ConfirmActionModal';
import { UserResponse } from '../../api/__generated__';
import { HttpStatusCode } from '../../api/httpHelpers';
import { useApi } from '../../api/starskyApiClient';
import { useAuth } from '../AuthProvider';

interface IInviteModalProps {
    authenticatedUser: UserResponse;
    trigger: ReactNode;
}

export const InviteModal: React.FC<IInviteModalProps> = (props: IInviteModalProps) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [errorOccurred, setErrorOccurred] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [loading, setLoading] = useState(false);

    const { token } = useAuth();
    const apis = useApi(token);

    const formName = 'formInviteEmployee';
    const formEmployeeName = 'formInviteEmployeeName';
    const formEmployeeEmail = 'formInviteEmployeeEmail';

    const handleOnCloseModal = async () => {
        setModalOpen(false);
        setLoading(false);
    };

    const handleOnSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        setErrorOccurred(false);

        const formData = new FormData(event.currentTarget);
        const employeeName = formData.get(formEmployeeName) as string;
        const email = formData.get(formEmployeeEmail) as string;

        await apis.inviteApi
            .postInvite({ createInviteRequest: { employeeName: employeeName, employeeEmail: email } })
            .then(() => {
                setModalOpen(false);
                setLoading(false);
            })
            .catch((reason) => {
                console.error(reason);
                if (reason instanceof Response && reason.status == HttpStatusCode.CONFLICT) {
                    setErrorMessage(`Email ${email} already exists. Has the user already registered? Please choose another email.`);
                } else {
                    setErrorMessage(`An unexpected error occurred. Please try again later.`);
                }
                setLoading(false);
                setErrorOccurred(true);
            });
    };

    return (
        <Modal
            onClose={handleOnCloseModal}
            onOpen={() => {
                setModalOpen(true);
                setLoading(false);
            }}
            open={modalOpen}
            closeIcon
            trigger={props.trigger}
        >
            <Modal.Header>Invite Employee</Modal.Header>
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
                            name={formEmployeeEmail}
                            required
                            type={'email'}
                        />
                        <Divider />
                        <FormField>
                            This will send an invite link to the employee&apos;s e-mail address. They will be able to register as your employee and login to the
                            platform.
                            <br />
                            Please note that an invite link will automatically expire in 3 days and you will have to re-send the invite.
                        </FormField>
                    </Form>
                </Modal.Description>
            </Modal.Content>
            <Modal.Actions>
                <Button content={'Send'} icon="checkmark" type="submit" positive form={formName} labelPosition="left" loading={loading} />
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
