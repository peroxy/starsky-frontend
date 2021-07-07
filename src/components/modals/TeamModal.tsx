import React, { useEffect, useState } from 'react';
import { Button, Dimmer, Form, Loader, Modal } from 'semantic-ui-react';
import { UserResponse } from '../../api/__generated__';
import { HttpStatusCode } from '../../api/httpHelpers';

export interface ITeamModalProps {
    teamName?: string;
    employees: UserResponse[];
    getTeamMembers?: Promise<UserResponse[]>;
    modalHeader: string;
    modalOkButtonText: string;
    trigger: React.ReactNode;
    onOkButtonClick: (teamName: string, teamMembers: UserResponse[]) => Promise<void>;
}

export const TeamModal: React.FC<ITeamModalProps> = (props: ITeamModalProps) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [errorOccurred, setErrorOccurred] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [loading, setLoading] = useState(true);

    const [selectedTeamMemberIds, setSelectedTeamMemberIds] = React.useState<number[]>([]);

    useEffect(() => {
        onLoad();
    }, []);

    async function onLoad() {
        if (props.getTeamMembers) {
            await props.getTeamMembers.then((members) => {
                setSelectedTeamMemberIds(members.map((value) => value.id as number));
            });
        }

        setLoading(false);
    }

    const formName = 'formTeam';
    const formTeamName = 'formTeamName';

    const handleOnSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        setErrorOccurred(false);

        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const teamName = formData.get(formTeamName) as string;

        await props
            .onOkButtonClick(
                teamName,
                props.employees.filter((x) => selectedTeamMemberIds.includes(x.id as number)),
            )
            .then(() => {
                setModalOpen(false);
            })
            .catch((reason) => {
                setErrorOccurred(true);
                console.error(reason);
                if (reason instanceof Response && reason.status == HttpStatusCode.CONFLICT) {
                    setErrorMessage(`Team name ${teamName} already exists. Please choose another team name.`);
                } else {
                    setErrorMessage(`An unexpected error occurred. Please try again later. [Error description: ${reason}]`);
                }
            });
    };

    if (loading) {
        return (
            <Dimmer active inverted>
                <Loader content="Please wait..." />
            </Dimmer>
        );
    } else {
        return (
            <Modal onClose={() => setModalOpen(false)} onOpen={() => setModalOpen(true)} open={modalOpen} closeIcon trigger={props.trigger}>
                <Modal.Header>{props.modalHeader}</Modal.Header>
                <Modal.Content>
                    <Modal.Description>
                        <Form onSubmit={handleOnSubmit} id={formName}>
                            <Form.Input
                                labelPosition={'left'}
                                label={'Team name:'}
                                fluid
                                placeholder={'My Awesome Team'}
                                icon={'users'}
                                iconPosition={'left'}
                                defaultValue={props.teamName}
                                name={formTeamName}
                                required
                            />
                            <Form.Dropdown
                                placeholder={'Select/search team members'}
                                fluid
                                multiple
                                search
                                selection
                                options={props.employees.map((employee) => {
                                    return { text: employee.name, key: employee.id, value: employee.id };
                                })}
                                label={'Team members:'}
                                defaultValue={selectedTeamMemberIds}
                                required
                                onChange={(event, data) => {
                                    setSelectedTeamMemberIds(data.value as number[]);
                                }}
                            />
                        </Form>
                    </Modal.Description>
                </Modal.Content>
                <Modal.Actions>
                    <Button content={props.modalOkButtonText} labelPosition="right" icon="checkmark" type="submit" positive form={formName} />
                </Modal.Actions>

                <Modal onClose={() => setErrorOccurred(false)} open={errorOccurred} size="tiny">
                    <Modal.Header>Error occurred</Modal.Header>
                    <Modal.Content>
                        <p>{errorMessage}</p>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button icon={'warning sign'} content="OK" onClick={() => setErrorOccurred(false)} negative />
                    </Modal.Actions>
                </Modal>
            </Modal>
        );
    }
};
