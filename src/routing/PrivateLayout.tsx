import {Route, Switch} from "react-router-dom";
import {PrivateRoute} from "./PrivateRoute";
import React from "react";
import {NavigationBar} from "../components/NavigationBar";
import {APP_ROUTE} from "./routeConstants";
import NotFound, {GoBackTo} from "../components/NotFound";

export const PrivateLayout = () =>
    <div>
        <Switch>
            <PrivateRoute exact path={APP_ROUTE} component={NavigationBar}/>
            <Route render={() => <NotFound goBackWhere={GoBackTo.App}/>}/>
        </Switch>
    </div>


