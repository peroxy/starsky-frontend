import React from 'react';
import logo from '../logo.svg'
import {Link} from "react-router-dom";
import {DASHBOARD_ROUTE, LOGIN_ROUTE} from "../routing/routeConstants";

export default class HomePage extends React.Component {
    render() {
        return (
            <div>
                <h1>STARSKY HOME - public</h1>
                <img src={logo} alt="Starsky logo" height={400} width={400}/>
                <Link to={LOGIN_ROUTE}>
                    <button>Login now my dude</button>
                </Link>
                <Link to={DASHBOARD_ROUTE}>
                    <button>Go to dashboard my dude</button>
                </Link>
            </div>
        );
    }
}