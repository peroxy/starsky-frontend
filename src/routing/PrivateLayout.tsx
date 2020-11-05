import {Switch} from "react-router-dom";
import {PrivateRoute} from "./PrivateRoute";
import DashboardPage from "../components/DashboardPage";
import React from "react";
import {TopMenu} from "../components/TopMenu";
import {DASHBOARD_ROUTE} from "./routeConstants";

export const PrivateLayout = () =>
    <div>
        <TopMenu/>
        <Switch>
            <PrivateRoute exact path={DASHBOARD_ROUTE} component={DashboardPage}/>
        </Switch>
    </div>


