import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Dimmer, Icon, List, Loader } from 'semantic-ui-react';
import { ActiveMenuItem, NavigationBar } from '../NavigationBar';
import { UserResponse } from '../../api/__generated__';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../AuthProvider';
import { useApi } from '../../api/starskyApiClient';
import { responseToString } from '../../api/httpHelpers';

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

    return loading ? (
        <Dimmer active inverted>
            <Loader content="Please wait..." />
        </Dimmer>
    ) : (
        <>
            <Helmet title={'Employees | Starsky'} />
            <NavigationBar activeMenuItem={ActiveMenuItem.Employees} authenticatedUser={authenticatedUser!}>
                <List divided relaxed size={'big'} selection className={'left-margin right-margin'}>
                    {employees.map((employee) => (
                        <List.Item key={employee.id}>
                            <Icon name={'user'} />
                            <List.Content>
                                <List.Header as={'a'}>{employee.name}</List.Header>
                                <List.Description>Job title: {employee.jobTitle}</List.Description>
                                <List.Description>E-mail: {employee.email}</List.Description>
                            </List.Content>
                        </List.Item>
                    ))}
                </List>
            </NavigationBar>
        </>
    );
};
