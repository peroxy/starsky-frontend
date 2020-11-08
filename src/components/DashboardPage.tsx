import React from 'react';
import {Helmet} from "react-helmet";

export default class DashboardPage extends React.Component<any, any> {
    render() {
        return (
          <div>
              <Helmet title={"Starsky | Dashboard"}/>
              <h1>Dashboard</h1>
              <h2>Welcome to your dashboard!</h2>
          </div>
        );
    }
}