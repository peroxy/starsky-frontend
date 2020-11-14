import React from 'react';
import {Route, Switch } from 'react-router-dom';
import HomePage from "../components/HomePage";
import {LoginPage} from "../components/LoginPage";
import {RegisterPage} from "../components/RegisterPage";
import {HOME_ROUTE, LOGIN_ROUTE, REGISTER_ROUTE} from "./routeConstants";

export const PublicLayout = () =>
    <Switch>
        <Route exact path={HOME_ROUTE} component={HomePage}/>
        <Route exact path={LOGIN_ROUTE} component={LoginPage}/>
        <Route exact path={REGISTER_ROUTE} component={RegisterPage}/>
    </Switch>