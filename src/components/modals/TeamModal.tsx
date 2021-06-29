import React, { useState } from 'react';
import { Button, Form, Modal } from 'semantic-ui-react';
import { UserResponse } from '../../api/__generated__';

export interface ITeamModalProps {
    teamName?: string;
    employees: UserResponse[];
    teamMembers?: UserResponse[];
    modalHeader: string;
    modalOkButtonText: string;
    trigger: React.ReactNode;
    onOkButtonClick: (teamName: string, teamMembers: UserResponse[]) => void;
}

export const TeamModal: React.FC<ITeamModalProps> = (props: ITeamModalProps) => {
    const [modalOpen, setModalOpen] = useState(false);

    let initialTeamMembers: number[] = [];
    if (props.teamMembers) {
        initialTeamMembers = props.teamMembers.map((value) => value.id as number);
    }
    const [selectedTeamMemberIds, setSelectedTeamMemberIds] = React.useState<number[]>(initialTeamMembers);

    const formName = 'formTeam';
    const formTeamName = 'formTeamName';

    const handleOnSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const teamName = formData.get(formTeamName) as string;

        //TODO: error handling, try catch here and then show something to user?
        props.onOkButtonClick(
            teamName,
            props.employees.filter((x) => selectedTeamMemberIds.includes(x.id as number)),
        );
        setModalOpen(false);
    };

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
                            defaultValue={props.teamMembers?.map((member) => member.id as number)}
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
        </Modal>
    );
};
