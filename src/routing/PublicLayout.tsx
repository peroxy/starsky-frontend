import React from 'react';
import {Route, Switch } from 'react-router-dom';
import HomePage from "../components/HomePage";
import {LoginPage} from "../components/LoginPage";
import {HOME_ROUTE, LOGIN_ROUTE} from "./routeConstants";

export const PublicLayout = () =>
    <Switch>
        <Route exact path={HOME_ROUTE} component={HomePage}/>
        <Route exact path={LOGIN_ROUTE} component={LoginPage}/>
    </Switch>