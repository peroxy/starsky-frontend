import React from 'react';
import { Helmet } from 'react-helmet';
import { Button, Divider, Grid, Header, Image } from 'semantic-ui-react';
import logo from '../images/logo.png';
import { Link } from 'react-router-dom';
import { APP_ROUTE, HOME_ROUTE, SCHEDULES_ROUTE, TEAMS_ROUTE } from '../routing/routeConstants';

export enum GoBackTo {
    Home,
    App,
    Schedules,
}

interface NotFoundProps {
    goBackWhere: GoBackTo;
    header: string;
}

export default function NotFound(props: NotFoundProps): JSX.Element {
    let goBackToUrl = '';
    let goBackText = 'Go back';
    switch (props.goBackWhere) {
        case GoBackTo.Home:
            goBackToUrl = HOME_ROUTE;
            goBackText = 'Go home';
            break;
        case GoBackTo.App:
            goBackToUrl = TEAMS_ROUTE;
            break;
        case GoBackTo.Schedules:
            goBackToUrl = SCHEDULES_ROUTE;
            break;
    }
    return (
        <div>
            <Helmet title={'Not found | Starsky'} />
            <Grid textAlign="center" style={{ height: '100vh' }} verticalAlign="middle">
                <Grid.Column style={{ maxWidth: 400 }}>
                    <Header as="h1" color="teal" textAlign="center">
                        <Image src={logo} /> {props.header}
                    </Header>
                    <Divider hidden />
                    <Divider />
                    <Divider hidden />
                    <Link to={goBackToUrl}>
                        <Button primary fluid size="huge">
                            {goBackText}
                        </Button>
                    </Link>
                </Grid.Column>
            </Grid>
        </div>
    );
}
