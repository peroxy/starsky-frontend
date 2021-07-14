import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Button, ButtonGroup, ButtonOr, Dimmer, Icon, Label, List, Loader, Popup } from 'semantic-ui-react';
import { ActiveMenuItem, NavigationBar } from '../NavigationBar';
import { UserResponse } from '../../api/__generated__';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../AuthProvider';
import { useApi } from '../../api/starskyApiClient';
import { responseToString } from '../../api/httpHelpers';
import { EmployeeModal } from '../modals/EmployeeModal';
import { InviteModal } from '../modals/InviteModal';

export const EmployeesPage: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [authenticatedUser, setAuthenticatedUser] = useState<UserResponse | null>(null);
    const [employees, setEmployees] = useState<UserResponse[]>([]);

    const location = useLocation();

    const { token } = useAuth();
    const apis = useApi(token);

    useEffect(() => {
        onLoad();
    }, []);

    async function onLoad() {
        const loadData = [];

        if (location.state == null) {
            loadData.push(
                apis.userApi.getUser().then((response) => {
                    setAuthenticatedUser(response);
                }),
            );
        } else {
            setAuthenticatedUser(location.state as UserResponse);
        }

        loadData.push(
            apis.employeeApi.getEmployees().then((response) => {
                setEmployees(response);
            }),
        );

        await Promise.all(loadData)
            .catch((reason: Response) => {
                console.error(responseToString(reason));
            })
            .finally(() => setLoading(false));
    }

    const handleOnCreateNewEmployee = async (employeeName: string, jobTitle: string, email: string) => {
        const employee = await apis.employeeApi.postEmployee({ createEmployeeRequest: { name: employeeName, email: email, jobTitle: jobTitle } });
        setEmployees((previousState) => [...previousState, employee]);
    };

    const handleOnEditEmployee = async (employeeName: string, jobTitle: string, email: string, id?: number) => {
        const employee = await apis.employeeApi.patchEmployee({
            employeeId: id as number,
            updateEmployeeRequest: { name: employeeName, email: email, jobTitle: jobTitle },
        });
        const updatedEmployees = [...employees];
        updatedEmployees[updatedEmployees.findIndex((value) => value.id == id)] = employee;
        setEmployees(updatedEmployees);
    };

    const handleOnDeleteEmployee = async (employee: UserResponse) => {
        await apis.employeeApi.deleteEmployee({ employeeId: employee.id });
        setEmployees(employees.filter((value) => value.id != employee.id));
    };

    return loading ? (
        <Dimmer active inverted>
            <Loader content="Please wait..." />
        </Dimmer>
    ) : (
        <>
            <Helmet title={'Employees | Starsky'} />
            <NavigationBar activeMenuItem={ActiveMenuItem.Employees} authenticatedUser={authenticatedUser!}>
                <ButtonGroup size="big" className={'left-margin'}>
                    <EmployeeModal
                        modalHeader={'Create Employee'}
                        modalOkButtonText={'Create'}
                        trigger={<Button primary content={'Create '} icon={'user plus'} />}
                        onOkButtonClick={handleOnCreateNewEmployee}
                    />
                    <ButtonOr />
                    <InviteModal authenticatedUser={authenticatedUser!} trigger={<Button primary content={'Invite '} icon={'mail'} />} />
                    <Popup
                        content={
                            'You can either manually create an employee (user will not be able to login into the platform, only be used in schedules) or invite an employee to register themselves (will be able to login and view schedules).'
                        }
                        trigger={<Button icon={'help'} as="a" />}
                        wide={'very'}
                    />
                </ButtonGroup>
                <List divided relaxed size={'big'} selection className={'left-margin right-margin'}>
                    {employees.map((employee) => (
                        <List.Item key={employee.id}>
                            <Icon name={'user'} />
                            <EmployeeModal
                                modalHeader="Edit Employee"
                                modalOkButtonText="Save"
                                trigger={
                                    <List.Content>
                                        <List.Header as={'a'}>{employee.name}</List.Header>
                                        <List.Description>Job title: {employee.jobTitle}</List.Description>
                                        <List.Description>E-mail: {employee.email}</List.Description>
                                    </List.Content>
                                }
                                onOkButtonClick={handleOnEditEmployee}
                                employee={employee}
                                onDeleteButtonClick={handleOnDeleteEmployee}
                            />
                        </List.Item>
                    ))}
                </List>
            </NavigationBar>
        </>
    );
};
