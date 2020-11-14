import {Button} from "semantic-ui-react";
import React from "react";
import { useHistory } from "react-router-dom";
import {HOME_ROUTE} from "../routing/routeConstants";
import {useAuth} from "./AuthProvider";

export function TopMenu() {

    const {clearToken} = useAuth();
    const history = useHistory();

    return(
        <div>
            <Button content="Logout" color="red" onClick={() => {
                clearToken();
                history.push(HOME_ROUTE);
            }}/>
        </div>
    );
}

