import React from 'react';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import {AuthProvider} from "./components/AuthProvider";
import {PublicLayout} from "./components/PublicLayout";
import {PrivateLayout} from "./components/PrivateLayout";

export default function App() {

    return (
        <AuthProvider>
            <Router>
                <Switch>
                    <Route path='/app' component={PrivateLayout}/>
                    <Route path='/' component={PublicLayout}/>
                </Switch>
            </Router>
        </AuthProvider>
    );
}