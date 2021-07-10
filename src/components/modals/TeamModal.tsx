import React, { useEffect, useState } from 'react';
import { Button, Dimmer, Form, Icon, Loader, Modal } from 'semantic-ui-react';
import { TeamResponse, UserResponse } from '../../api/__generated__';
import { HttpStatusCode } from '../../api/httpHelpers';
import { ConfirmActionModal } from './ConfirmActionModal';

export interface ITeamModalProps {
    team?: TeamResponse;
    employees: UserResponse[];
    getTeamMembers?: () => Promise<UserResponse[]>;
    modalHeader: string;
    modalOkButtonText: string;
    trigger: React.ReactNode;
    onOkButtonClick: (teamName: string | undefined, teamId: number, teamMembers: UserResponse[], teamMembersUpdated?: boolean) => Promise<void>;
    onDeleteButtonClick?: (teamId: number) => Promise<void>;
}

export const TeamModal: React.FC<ITeamModalProps> = (props: ITeamModalProps) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [errorOccurred, setErrorOccurred] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [loading, setLoading] = useState(true);

    const [selectedTeamMemberIds, setSelectedTeamMemberIds] = React.useState<number[]>([]);
    const [anyTeamMembersUpdated, setAnyTeamMembersUpdated] = useState(false);

    useEffect(() => {
        if (modalOpen && loading) {
            onLoad();
        }
    }, [modalOpen]);

    async function onLoad() {
        if (props.getTeamMembers) {
            await props.getTeamMembers?.().then((members) => {
                setSelectedTeamMemberIds(members.map((value) => value.id));
            });
        }
        setLoading(false);
    }

    const formName = 'formTeam';
    const formTeamName = 'formTeamName';

    const handleOnCloseModal = async () => {
        setModalOpen(false);
        setLoading(true);
        setAnyTeamMembersUpdated(false);
    };

    const handleOnSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        setErrorOccurred(false);

        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const teamName = formData.get(formTeamName) as string;

        await props
            .onOkButtonClick(
                teamName,
                props.team?.id as number,
                props.employees.filter((x) => selectedTeamMemberIds.includes(x.id)),
                anyTeamMembersUpdated,
            )
            .then(() => {
                setModalOpen(false);
            })
            .catch((reason) => {
                console.error(reason);
                if (reason instanceof Response && reason.status == HttpStatusCode.CONFLICT) {
                    setErrorMessage(`Team name ${teamName} already exists. Please choose another team name.`);
                } else {
                    setErrorMessage(`An unexpected error occurred. Please try again later.`);
                }
                setErrorOccurred(true);
            });
    };

    const handleOnConfirm = async (confirmed: boolean) => {
        if (confirmed) {
            setErrorOccurred(false);

            await props
                .onDeleteButtonClick?.(props.team?.id as number)
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

    if (loading && modalOpen) {
        return (
            <Dimmer active inverted>
                <Loader content="Please wait..." />
            </Dimmer>
        );
    } else {
        return (
            <Modal onClose={handleOnCloseModal} onOpen={() => setModalOpen(true)} open={modalOpen} closeIcon trigger={props.trigger}>
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
                                defaultValue={props.team?.name}
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
                                onChange={(event, data) => {
                                    setSelectedTeamMemberIds(data.value as number[]);
                                    setAnyTeamMembersUpdated(true);
                                }}
                            />
                        </Form>
                    </Modal.Description>
                </Modal.Content>
                <Modal.Actions>
                    {props.onDeleteButtonClick ? (
                        <ConfirmActionModal
                            title={'Delete This Team'}
                            message={`Are you sure you would like to delete team: '${props.team?.name}'?\nThis action is permanent and cannot be undone!`}
                            icon={<Icon name="trash" />}
                            onConfirm={handleOnConfirm}
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
    }
};
