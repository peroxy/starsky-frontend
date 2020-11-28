import {Route, Switch} from "react-router-dom";
import {PrivateRoute} from "./PrivateRoute";
import TeamsPage from "../components/pages/TeamsPage";
import React from "react";
import {TopMenu} from "../components/TopMenu";
import {TEAMS_ROUTE} from "./routeConstants";
import NotFound, {GoBackTo} from "../components/NotFound";

export const PrivateLayout = () =>
    <div>
        <TopMenu/>
        <Switch>
            <PrivateRoute exact path={TEAMS_ROUTE} component={TeamsPage}/>
            <Route render={() => <NotFound goBackWhere={GoBackTo.Dashboard}/>}/>
        </Switch>
    </div>


