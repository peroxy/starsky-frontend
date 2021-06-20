import {Dropdown, Icon, Image, Loader, Menu} from "semantic-ui-react";
import React, {useEffect, useState} from "react";
import {useHistory} from "react-router-dom";
import {HOME_ROUTE} from "../routing/routeConstants";
import {useAuth} from "./AuthProvider";
import logo from "../images/logo.png";
import {useApi} from "../api/starskyApiClient";
import TeamsPage from "./pages/TeamsPage";
import EmployeesPage from "./pages/EmployeesPage";
import SchedulesPage from "./pages/SchedulesPages";
import SettingsPage from "./pages/SettingsPage";
import {UserResponse} from "../api/__generated__/starskyApi";
import {responseToString} from "../api/httpHelpers";

export enum ActiveMenuItem {
    Teams,
    Employees,
    Schedules,
    Settings
}

export function NavigationBar() {

    const {clearToken, token} = useAuth();
    const history = useHistory();
    const apiClient = useApi({accessToken: token});
    apiClient.setSecurityData({accessToken: token});

    const [user, setUser] = useState<UserResponse>();
    const [userLoading, setUserLoading] = useState(true);
    const [activeMenuItem, setActiveMenuItem] = useState(ActiveMenuItem.Teams);

    useEffect(() => {
        // noinspection JSIgnoredPromiseFromCall
        onLoad()
    }, []);

    async function onLoad() {
        if (user == null) {
            const response = await apiClient.user.getUser();
            if (response.ok) {
                setUser(response.data);
                setUserLoading(false);
            } else {
                console.error(responseToString(response));
            }
        }
    }

    const getActiveComponent = () => {
        switch (activeMenuItem) {
            case ActiveMenuItem.Teams:
                return <TeamsPage/>;
            case ActiveMenuItem.Employees:
                return <EmployeesPage/>;
            case ActiveMenuItem.Schedules:
                return <SchedulesPage/>;
            case ActiveMenuItem.Settings:
                return <SettingsPage/>;
        }
    }

    return (
        <div>
            <Menu stackable inverted>
                <Menu.Item content='Home' style={{justifyContent: 'center'}} onClick={() => history.push(HOME_ROUTE)}>
                    <Image src={logo} height='25em'/>
                </Menu.Item>

                <Menu.Item content='Teams' active={activeMenuItem === ActiveMenuItem.Teams} onClick={() => setActiveMenuItem(ActiveMenuItem.Teams)}
                           color={"teal"} style={{justifyContent: 'center'}}/>
                <Menu.Item content='Employees' active={activeMenuItem === ActiveMenuItem.Employees} onClick={() => setActiveMenuItem(ActiveMenuItem.Employees)}
                           color={"teal"} style={{justifyContent: 'center'}}/>
                <Menu.Item content='Schedules' active={activeMenuItem === ActiveMenuItem.Schedules} onClick={() => setActiveMenuItem(ActiveMenuItem.Schedules)}
                           color={"teal"} style={{justifyContent: 'center'}}/>

                <Menu.Item position={"right"} style={{justifyContent: 'center', width: '20em'}} active={activeMenuItem === ActiveMenuItem.Settings}
                           color={"teal"}>
                    <Dropdown item text={"Settings"} style={{justifyContent: 'center', width: '20em',}}>
                        <Dropdown.Menu>
                            <Dropdown.Item style={{pointerEvents: "none"}}>
                                <Icon name={"user"}/>
                                {userLoading ? <Loader active size='mini'/> : <label>{`${user?.name} (${user?.email})`}</label>}
                            </Dropdown.Item>
                            <Dropdown.Divider/>
                            <Dropdown.Item icon='edit' text='Edit Profile' onClick={() => setActiveMenuItem(ActiveMenuItem.Settings)}/>
                            <Dropdown.Item icon='globe' text='Choose Language'/>
                            <Dropdown.Divider/>
                            <Dropdown.Item icon='log out' error onClick={() => {
                                clearToken();
                                history.push(HOME_ROUTE);
                            }}>
                                <div style={{fontWeight: "bold"}}>
                                    <Icon name={"log out"}/>
                                    Logout
                                </div>
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Menu.Item>
            </Menu>
            {getActiveComponent()}
        </div>
    );
}

