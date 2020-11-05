import React from 'react';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import {AuthProvider} from "./components/AuthProvider";
import {PublicLayout} from "./routing/PublicLayout";
import {PrivateLayout} from "./routing/PrivateLayout";
import {APP_ROUTE, HOME_ROUTE} from "./routing/routeConstants"
import "./css/style.css"

export default function App() {

    return (
        <AuthProvider>
            <Router>
                <Switch>
                    <Route path={APP_ROUTE} component={PrivateLayout}/>
                    <Route path={HOME_ROUTE} component={PublicLayout}/>
                </Switch>
            </Router>
        </AuthProvider>
    );
}