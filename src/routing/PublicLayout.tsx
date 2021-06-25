import React from 'react';
import { Route, Switch } from 'react-router-dom';
import HomePage from '../components/pages/HomePage';
import { LoginPage } from '../components/pages/LoginPage';
import { RegisterPage } from '../components/pages/RegisterPage';
import { HOME_ROUTE, LOGIN_ROUTE, REGISTER_ROUTE } from './routeConstants';
import NotFound, { GoBackTo } from '../components/NotFound';

export const PublicLayout = () => (
    <Switch>
        <Route exact path={HOME_ROUTE} component={HomePage} />
        <Route exact path={LOGIN_ROUTE} component={LoginPage} />
        <Route exact path={REGISTER_ROUTE} component={RegisterPage} />
        <Route render={() => <NotFound goBackWhere={GoBackTo.Home} />} />
    </Switch>
);
