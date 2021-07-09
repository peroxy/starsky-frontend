import { Icon, Menu, Sidebar } from 'semantic-ui-react';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { EMPLOYEES_ROUTE, HOME_ROUTE, SCHEDULES_ROUTE, SETTINGS_ROUTE, TEAMS_ROUTE } from '../routing/routeConstants';
import { useAuth } from './AuthProvider';
import { UserResponse } from '../api/__generated__';
import { useMediaQuery } from 'react-responsive';

export enum ActiveMenuItem {
    Teams,
    Employees,
    Schedules,
    EditProfile,
    LogOut,
}

export interface INavigationBarProps {
    activeMenuItem: ActiveMenuItem;
    authenticatedUser: UserResponse;
}

export const NavigationBar: React.FC<INavigationBarProps> = ({ children, activeMenuItem, authenticatedUser }) => {
    const history = useHistory();
    const { clearToken } = useAuth();

    const isMobile = useMediaQuery({ query: `(max-width: 768px)` }); //todo move to a util class or sth so its easier to use
    const [sidebarOpened, setSidebarOpened] = useState(!isMobile);

    return (
        <>
            <Sidebar.Pushable className={'full-size'} closable={'false'}>
                <Menu size={'massive'} inverted>
                    <Menu.Item onClick={() => setSidebarOpened(!sidebarOpened)}>
                        <Icon name="sidebar" />
                    </Menu.Item>
                </Menu>
                <Sidebar
                    as={Menu}
                    icon={'labeled'}
                    animation="push"
                    inverted
                    onHide={() => setSidebarOpened(false)}
                    vertical
                    visible={sidebarOpened}
                    width={isMobile ? 'thin' : 'wide'}
                    size={'massive'}
                >
                    <Menu.Item onClick={() => setSidebarOpened(false)} position={'left'} icon={'sidebar'} size="mini" />
                    <Menu.Item content="Home" onClick={() => history.push(HOME_ROUTE)} />

                    <Menu.Item
                        content="Teams"
                        active={activeMenuItem === ActiveMenuItem.Teams}
                        onClick={() => history.push(TEAMS_ROUTE, authenticatedUser)}
                        color={'teal'}
                    />
                    <Menu.Item
                        content="Employees"
                        active={activeMenuItem === ActiveMenuItem.Employees}
                        onClick={() => history.push(EMPLOYEES_ROUTE, authenticatedUser)}
                        color={'teal'}
                    />
                    <Menu.Item
                        content="Schedules"
                        active={activeMenuItem === ActiveMenuItem.Schedules}
                        onClick={() => history.push(SCHEDULES_ROUTE, authenticatedUser)}
                        color={'teal'}
                    />

                    <Menu.Item
                        content="Edit profile"
                        active={activeMenuItem === ActiveMenuItem.EditProfile}
                        onClick={() => history.push(SETTINGS_ROUTE, authenticatedUser)}
                        color={'teal'}
                    />

                    <Menu.Item
                        content="Log out"
                        active={activeMenuItem === ActiveMenuItem.LogOut}
                        color={'teal'}
                        onClick={() => {
                            clearToken();
                            history.push(HOME_ROUTE);
                        }}
                    />
                </Sidebar>
                <Sidebar.Pusher>{children}</Sidebar.Pusher>
            </Sidebar.Pushable>
        </>
    );
};
