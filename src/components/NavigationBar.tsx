import { Dropdown, Icon, Image, Menu } from 'semantic-ui-react';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { EMPLOYEES_ROUTE, HOME_ROUTE, SCHEDULES_ROUTE, SETTINGS_ROUTE, TEAMS_ROUTE } from '../routing/routeConstants';
import { useAuth } from './AuthProvider';
import logo from '../images/logo.png';
import { UserResponse } from '../api/__generated__';

export enum ActiveMenuItem {
    Teams,
    Employees,
    Schedules,
    Settings,
}

export interface INavigationBarProps {
    activeMenuItem: ActiveMenuItem;
    authenticatedUser: UserResponse;
}

export const NavigationBarV2: React.FC<INavigationBarProps> = ({ activeMenuItem, authenticatedUser }) => {
    const history = useHistory();
    const { clearToken } = useAuth();
    return (
        <>
            <Menu stackable inverted>
                <Menu.Item content="Home" style={{ justifyContent: 'center' }} onClick={() => history.push(HOME_ROUTE)}>
                    <Image src={logo} height="25em" />
                </Menu.Item>

                <Menu.Item
                    content="Teams"
                    active={activeMenuItem === ActiveMenuItem.Teams}
                    onClick={() => history.push(TEAMS_ROUTE, authenticatedUser)}
                    color={'teal'}
                    style={{ justifyContent: 'center' }}
                />
                <Menu.Item
                    content="Employees"
                    active={activeMenuItem === ActiveMenuItem.Employees}
                    onClick={() => history.push(EMPLOYEES_ROUTE, authenticatedUser)}
                    color={'teal'}
                    style={{ justifyContent: 'center' }}
                />
                <Menu.Item
                    content="Schedules"
                    active={activeMenuItem === ActiveMenuItem.Schedules}
                    onClick={() => history.push(SCHEDULES_ROUTE, authenticatedUser)}
                    color={'teal'}
                    style={{ justifyContent: 'center' }}
                />

                <Menu.Item
                    position={'right'}
                    style={{ justifyContent: 'center', width: '20em' }}
                    active={activeMenuItem === ActiveMenuItem.Settings}
                    color={'teal'}
                >
                    <Dropdown item text={'Settings'} style={{ justifyContent: 'center', width: '20em' }}>
                        <Dropdown.Menu>
                            <Dropdown.Item style={{ pointerEvents: 'none' }}>
                                <Icon name={'user'} />
                                <label>{`${authenticatedUser?.name} (${authenticatedUser?.email})`}</label>
                            </Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item icon="edit" text="Edit Profile" onClick={() => history.push(SETTINGS_ROUTE, authenticatedUser)} />
                            {/*TODO:*/}
                            <Dropdown.Item icon="globe" text="Choose Language" onClick={() => console.warn('TODO')} />
                            <Dropdown.Divider />
                            <Dropdown.Item
                                icon="log out"
                                error
                                onClick={() => {
                                    clearToken();
                                    history.push(HOME_ROUTE);
                                }}
                            >
                                <div style={{ fontWeight: 'bold' }}>
                                    <Icon name={'log out'} />
                                    Logout
                                </div>
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Menu.Item>
            </Menu>
        </>
    );
};
