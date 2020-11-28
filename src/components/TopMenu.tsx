import {Dropdown, Icon, Image, Loader, Menu} from "semantic-ui-react";
import React, {useEffect, useState} from "react";
import {useHistory} from "react-router-dom";
import {HOME_ROUTE} from "../routing/routeConstants";
import {useAuth} from "./AuthProvider";
import logo from "../images/logo.png";
import {isErrorResponse} from "../api/responses";
import {StarskyApiClient} from "../api/starskyApiClient";
import {IUserState} from "../states/IUserState";

export enum ActiveMenuItem {
    Teams,
    Employees,
    Schedules
}

export function TopMenu() {

    const {clearToken, token} = useAuth();
    const history = useHistory();
    const apiClient = new StarskyApiClient();

    const [user, setUser] = useState<IUserState>();
    const [userLoading, setUserLoading] = useState(true);
    const [activeMenuItem, setActiveMenuItem] = useState(ActiveMenuItem.Teams);

    useEffect(() => {
        onLoad()
    }, []);

    async function onLoad() {
        if (user == null) {
            const response = await apiClient.getUser(token as string);
            if (!isErrorResponse(response)) {
                setUser(response);
                setUserLoading(false);
            } else {
                console.error(response.error_detail);
            }
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
                <Menu.Item position={"right"} style={{justifyContent: 'center', width: '20em'}}>
                    <Dropdown item text={"Settings"} style={{justifyContent: 'center', width: '20em',}}>
                        <Dropdown.Menu>
                            <Dropdown.Item style={{pointerEvents: "none"}}>
                                <Icon name={"user"}/>
                                {userLoading ? <Loader active size='mini'/> : <label>{`${user?.name} (${user?.email})`}</label>}
                            </Dropdown.Item>
                            <Dropdown.Divider/>
                            <Dropdown.Item icon='edit' text='Edit Profile'/>
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
        </div>
    );
}

