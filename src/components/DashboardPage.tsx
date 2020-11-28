import React from 'react';
import {Helmet} from "react-helmet";

export default function DashboardPage() {

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
            {getDashboard()}
        </div>
    );
}