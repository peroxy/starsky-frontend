import {Route, Switch} from "react-router-dom";
import {PrivateRoute} from "./PrivateRoute";
import DashboardPage from "./DashboardPage";
import React from "react";
import {TopMenu} from "./TopMenu";

export const PrivateLayout = (props : any) =>
    <div>
        <TopMenu/>
        <Switch>
            <PrivateRoute exact path='/app/dashboard' component={DashboardPage}/>
        </Switch>
    </div>


