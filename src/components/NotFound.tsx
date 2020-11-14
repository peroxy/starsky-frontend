import React from 'react';
import {Helmet} from "react-helmet";
import {Button, Divider, Grid, Header, Image} from "semantic-ui-react";
import logo from "../images/logo.png";
import {Link} from "react-router-dom";
import {DASHBOARD_ROUTE, HOME_ROUTE} from "../routing/routeConstants";

export enum GoBackTo {
    Home,
    Dashboard
}

interface NotFoundProps {
    goBackWhere : GoBackTo
}

export default function NotFound(props : NotFoundProps) {
    console.log(props.goBackWhere);
    return (
        <div>
            <Helmet title={"Starsky | Not found"}/>
            <Grid textAlign='center' style={{height: '100vh'}} verticalAlign='middle'>
                <Grid.Column style={{maxWidth: 400}}>
                    <Header as='h1' color='teal' textAlign='center'>
                        <Image src={logo}/> Page Not Found
                    </Header>
                    <Divider hidden/>
                    <Divider/>
                    <Divider hidden/>
                    <Link to={props.goBackWhere === GoBackTo.Home ? HOME_ROUTE : DASHBOARD_ROUTE}>
                        <Button color='teal' fluid size='huge'>{props.goBackWhere === GoBackTo.Home ? "Go home" : "Go back to dashboard"}</Button>
                    </Link>
                </Grid.Column>
            </Grid>
        </div>
    );

}