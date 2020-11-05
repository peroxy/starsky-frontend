import {Button} from "semantic-ui-react";
import React from "react";
import {AuthContext} from "./AuthProvider";
import { useHistory } from "react-router-dom";
import {HOME_ROUTE} from "../routing/routeConstants";

export function TopMenu() {

    const {clearToken} = React.useContext(AuthContext);
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

