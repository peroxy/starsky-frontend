import {Button} from "semantic-ui-react";
import React from "react";
import {AuthContext} from "./AuthProvider";
import { useHistory } from "react-router-dom";

export function TopMenu() {

    const {clearToken} = React.useContext(AuthContext);
    const history = useHistory();

    return(
        <div>
            <Button content="Logout" color="red" onClick={() => {
                clearToken();
                history.push("/");
            }}/>
        </div>
    );
}

