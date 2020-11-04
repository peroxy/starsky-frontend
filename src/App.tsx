import React from 'react';
import {Login} from "./components/LoginPage";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import DashboardPage from "./components/DashboardPage";
import HomePage from "./components/HomePage";
import {PrivateRoute} from "./components/PrivateRoute"
import {TopMenu} from "./components/TopMenu";
import {AuthProvider} from "./components/AuthProvider";

export default function App() {

    return (
        <AuthProvider>
            <Router>
                <TopMenu/>
                <Switch>
                    <Route exact path='/' component={HomePage}/>
                    <Route path='/login' component={Login}/>
                    <PrivateRoute path='/dashboard' component={DashboardPage}/>
                </Switch>
            </Router>
        </AuthProvider>
    );
}