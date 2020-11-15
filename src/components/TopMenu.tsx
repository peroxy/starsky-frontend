import {Dropdown, Icon, Image, Menu} from "semantic-ui-react";
import React, {useState} from "react";
import {useHistory} from "react-router-dom";
import {HOME_ROUTE} from "../routing/routeConstants";
import {useAuth} from "./AuthProvider";
import logo from "../images/logo.png";

export enum ActiveMenuItem {
    Teams,
    Employees,
    Schedules,
    Settings
}

export function TopMenu() {

    const {clearToken, user} = useAuth();
    const history = useHistory();

    const [activeMenuItem, setActiveMenuItem] = useState(ActiveMenuItem.Teams);

    return (
        <div>
            <Menu stackable inverted widths={5}>
                <Menu.Item content='Home' header style={{justifyContent: 'center'}}>
                    <Image src={logo} height='25em'/>
                </Menu.Item>

                <Menu.Item content='Teams' active={activeMenuItem === ActiveMenuItem.Teams} onClick={() => setActiveMenuItem(ActiveMenuItem.Teams)}
                           color={"teal"} style={{justifyContent: 'center'}}/>
                <Menu.Item content='Employees' active={activeMenuItem === ActiveMenuItem.Employees} onClick={() => setActiveMenuItem(ActiveMenuItem.Employees)}
                           color={"teal"} style={{justifyContent: 'center'}}/>
                <Menu.Item content='Schedules' active={activeMenuItem === ActiveMenuItem.Schedules} onClick={() => setActiveMenuItem(ActiveMenuItem.Schedules)}
                           color={"teal"} style={{justifyContent: 'center'}}/>

                <Dropdown item text={"Settings"} style={{justifyContent: 'center'}} position={"right"}>
                    <Dropdown.Menu>
                        <Dropdown.Item style={{pointerEvents: "none"}}>
                            <Icon name={"user"}/>
                            <label>{`${user?.name} (${user?.email})`}</label>
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

            </Menu>

        </div>
    );
}

