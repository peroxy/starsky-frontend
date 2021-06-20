import React, {useEffect, useState} from 'react';

import { Redirect, Route } from 'react-router-dom';
import {useAuth} from "../components/AuthProvider";
import {Dimmer, Loader} from "semantic-ui-react";
import {LOGIN_ROUTE} from "./routeConstants";
import {useApi} from "../api/starskyApiClient";

export function PrivateRoute({component: Component, ...rest}: any) {
    const {token} = useAuth();
    const [authenticated, setAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    const client = useApi({accessToken: token});

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
        const response = await client.user.validateAuthentication();
        setAuthenticated(response.ok);
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