import {
    Button,
    Card,
    Container,
    Dimmer,
    Divider,
    Grid,
    GridColumn,
    GridRow,
    Header,
    Icon,
    Menu,
    MenuItem,
    Popup,
    Ref,
    Segment,
    Sidebar,
} from 'semantic-ui-react';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { EMPLOYEES_ROUTE, HOME_ROUTE, INVITATIONS_ROUTE, SCHEDULES_ROUTE, SETTINGS_ROUTE, TEAMS_ROUTE } from '../routing/routeConstants';
import { useAuth } from './AuthProvider';
import { UserResponse } from '../api/__generated__';
import { useMediaQuery } from 'react-responsive';
import { MAX_MOBILE_WIDTH } from '../util/mediaConstants';

export enum ActiveMenuItem {
    Teams,
    Employees,
    Schedules,
    EditProfile,
    Invitations,
}

export interface INavigationBarProps {
    activeMenuItem: ActiveMenuItem;
    authenticatedUser: UserResponse;
}

export const NavigationBar: React.FC<INavigationBarProps> = ({ children, activeMenuItem, authenticatedUser }) => {
    const history = useHistory();
    const { clearToken } = useAuth();

    const isMobile = useMediaQuery({ query: `(max-width: ${MAX_MOBILE_WIDTH}px)` });
    const [sidebarOpened, setSidebarOpened] = useState(false);
    const [dimmerActive, setDimmerActive] = useState(false);

    function handleLogout() {
        clearToken();
        history.push(HOME_ROUTE);
    }

    const invitationsMenuItem = (
        <Menu.Item
            content="Invitations"
            active={activeMenuItem === ActiveMenuItem.Invitations}
            onClick={() => history.push(INVITATIONS_ROUTE, authenticatedUser)}
        />
    );

    const homeMenuItem = <Menu.Item content="Home" onClick={() => history.push(HOME_ROUTE)} />;

    const teamsMenuItem = (
        <Menu.Item content="Teams" active={activeMenuItem === ActiveMenuItem.Teams} onClick={() => history.push(TEAMS_ROUTE, authenticatedUser)} />
    );

    const employeesMenuItem = (
        <Menu.Item content="Employees" active={activeMenuItem === ActiveMenuItem.Employees} onClick={() => history.push(EMPLOYEES_ROUTE, authenticatedUser)} />
    );

    const schedulesMenuItem = (
        <Menu.Item content="Schedules" active={activeMenuItem === ActiveMenuItem.Schedules} onClick={() => history.push(SCHEDULES_ROUTE, authenticatedUser)} />
    );

    const userProfileMenuItem = (
        <Popup
            flowing
            trigger={
                <Menu.Item position={'right'}>
                    <Icon name={'user'} />
                    <Icon name={'dropdown'} />
                </Menu.Item>
            }
            on={'click'}
            position={'bottom right'}
            onOpen={() => setDimmerActive(true)}
            onClose={() => setDimmerActive(false)}
        >
            <Card>
                <Card.Content header={`${authenticatedUser.name}`} description={`${authenticatedUser.email}`} textAlign={'center'} />
                <Card.Content extra textAlign={'center'}>
                    <Icon name="briefcase" /> {authenticatedUser.jobTitle}
                </Card.Content>
                <Card.Content>
                    <Button content={'Edit profile'} className={'full-width'} onClick={() => history.push(SETTINGS_ROUTE, authenticatedUser)} />
                    <Divider />
                    <Button content={'Sign out'} className={'full-width'} secondary onClick={handleLogout} />
                </Card.Content>
            </Card>
        </Popup>
    );

    const getMobileLayout = () => {
        return (
            <Sidebar.Pushable className={'full-size'}>
                <Menu size={'massive'} inverted className={'no-bottom-margin'}>
                    <Menu.Item
                        onClick={() => {
                            setSidebarOpened(true);
                        }}
                    >
                        <Icon name="sidebar" />
                    </Menu.Item>
                    {userProfileMenuItem}
                </Menu>
                <Sidebar
                    as={Menu}
                    icon={'labeled'}
                    animation="push"
                    inverted
                    onHide={() => setSidebarOpened(false)}
                    vertical
                    visible={sidebarOpened}
                    width={'thin'}
                    size={'massive'}
                    borderless
                >
                    <Menu.Item
                        onClick={() => {
                            setSidebarOpened(false);
                        }}
                        position={'left'}
                        icon={'sidebar'}
                        size="mini"
                    />
                    <Divider className="no-top-bottom-margin" />
                    {homeMenuItem}
                    <Divider className="no-top-bottom-margin" />
                    {teamsMenuItem}
                    <Divider className="no-top-bottom-margin" />
                    {employeesMenuItem}
                    <Menu.Menu>{invitationsMenuItem}</Menu.Menu>
                    <Divider className="no-top-bottom-margin" />
                    {schedulesMenuItem}
                    <Divider className="no-top-bottom-margin" />
                </Sidebar>
                <Sidebar.Pusher dimmed={sidebarOpened} className={'full-size'}>
                    <Divider className={'invisible'} />
                    <Dimmer active={dimmerActive} />
                    {children}
                </Sidebar.Pusher>
            </Sidebar.Pushable>
        );
    };

    const getDesktopLayout = () => {
        return (
            <>
                <Menu size={'massive'} inverted>
                    {homeMenuItem}
                    {teamsMenuItem}
                    {employeesMenuItem}
                    {invitationsMenuItem}
                    {schedulesMenuItem}
                    {userProfileMenuItem}
                </Menu>
                <Dimmer active={dimmerActive} />
                <Grid centered>
                    <GridColumn width={1} />
                    <GridColumn width={10}>
                        <Segment className="menu-children">{children}</Segment>
                    </GridColumn>
                    <GridColumn width={1} />
                </Grid>
            </>
        );
    };

    return isMobile ? getMobileLayout() : getDesktopLayout();
};
