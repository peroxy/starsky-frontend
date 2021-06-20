import {env} from "../util/envHelper";
import {Api} from "./__generated__/starskyApi";

export type SecurityDataType = {
    accessToken : string | null
};

const api = new Api({
    baseUrl: env("REACT_APP_BACKEND_HOST"),
    securityWorker(securityData: SecurityDataType | null) {
        if (securityData && securityData.accessToken){
            return {
                headers : {
                    Authorization: `Bearer ${securityData.accessToken}`
                }
            };
        }
    }
});

export function useApi(security : SecurityDataType) : Api<SecurityDataType> {
    api.setSecurityData(security);
    return api;
}