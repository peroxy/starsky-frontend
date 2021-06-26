import { Route, Switch } from 'react-router-dom';
import { PrivateRoute } from './PrivateRoute';
import React from 'react';
import { SCHEDULES_ROUTE, SETTINGS_ROUTE, EMPLOYEES_ROUTE, TEAMS_ROUTE } from './routeConstants';
import NotFound, { GoBackTo } from '../components/NotFound';
import { SettingsPage } from '../components/pages/SettingsPage';
import { EmployeesPage } from '../components/pages/EmployeesPage';
import { TeamsPage } from '../components/pages/TeamsPage';
import { SchedulesPage } from '../components/pages/SchedulesPages';

export const PrivateLayout = () => (
    <div>
        <Switch>
            <PrivateRoute exact path={SETTINGS_ROUTE} component={SettingsPage} />
            <PrivateRoute exact path={SCHEDULES_ROUTE} component={SchedulesPage} />
            <PrivateRoute exact path={EMPLOYEES_ROUTE} component={EmployeesPage} />
            <PrivateRoute exact path={TEAMS_ROUTE} component={TeamsPage} />
            <Route render={() => <NotFound goBackWhere={GoBackTo.App} />} />
        </Switch>
    </div>
);
