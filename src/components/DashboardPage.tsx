import React, {useEffect, useState} from 'react';
import {Helmet} from "react-helmet";
import {useHistory, useLocation} from 'react-router-dom';
import {IUserState} from "../states/IUserState";
import {StarskyApiClient} from "../api/starskyApiClient";
import {useAuth} from "./AuthProvider";
import {isErrorResponse} from "../api/responses";
import {Dimmer, Loader} from "semantic-ui-react";

export default function DashboardPage() {

    const[user, setUser] = useState(useLocation<IUserState>().state);

    const history = useHistory()
    const apiClient = new StarskyApiClient();
    const {token} = useAuth();


    useEffect(() => {
        onLoad()
    }, []);

    async function onLoad() {
        if (user == null) {
            const response = await apiClient.getUser(token as string);
            if (!isErrorResponse(response)){
                setUser(response);
            } else {
                console.error(response.error_detail);
            }
        }
    }

    const getDashboard = () => {
        return (
            <div>
                <h1>Dashboard</h1>
                What do you want to do today?
            </div>
        );
    };

    return (
        <div>
            <Helmet title={"Starsky | Dashboard"}/>
            {user == null ?
                <Dimmer active inverted><Loader content="Loading..."/></Dimmer>
                : getDashboard()}
        </div>
    );
}