import React, {useEffect, useState} from 'react';

import { Redirect, Route } from 'react-router-dom';
import {useAuth} from "../components/AuthProvider";
import {StarskyApiClient} from "../api/starskyApiClient";
import {Dimmer, Loader} from "semantic-ui-react";
import {LOGIN_ROUTE} from "./routeConstants";

export function PrivateRoute({component: Component, ...rest}: any) {
    const {token} = useAuth();
    const [authenticated, setAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    const client = new StarskyApiClient();

    useEffect(() => {
        // noinspection JSIgnoredPromiseFromCall
        onLoad()
    }, []);

    async function onLoad() {
        if (token == null || !token) {
            setAuthenticated(false);
            setLoading(false);
            return;
        }
        const isValid = await client.validateToken(token);
        setAuthenticated(isValid);
        setLoading(false);
    }

    return (
        <Route {...rest}
               render={(props) => authenticated
                   ? <Component {...props} /> : loading ? <Dimmer active inverted><Loader content="loading" /></Dimmer> :
                       <Redirect to={{pathname: LOGIN_ROUTE, state: {from: props.location}}}/>}
        />
    )
}