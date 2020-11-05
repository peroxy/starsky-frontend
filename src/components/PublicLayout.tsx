import React from 'react';
import {Route, Switch } from 'react-router-dom';
import HomePage from "./HomePage";
import {LoginPage} from "./LoginPage";

export const PublicLayout = (props : any) =>
    <Switch>
        <Route exact path='/' component={HomePage}/>
        <Route exact path='/login' component={LoginPage}/>
    </Switch>