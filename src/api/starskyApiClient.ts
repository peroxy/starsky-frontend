import {LoginModel} from "./models";
import {HttpMethod} from "./httpMethod";
import {env} from "../util/envHelper";
import {HttpStatusCode} from "./httpStatusCode";
import {ErrorResponse, TokenResponse} from "./responses";

export class StarskyApiClient {
    private readonly apiHostUrl : string
    constructor() {
        this.apiHostUrl = env("REACT_APP_BACKEND_HOST");
        console.log(this.apiHostUrl)
    }

    private getHeaders(){
        return {
            "Content-Type": "application/json"
        };
    }

    private getApiUrl(route: string){
        const url : URL = new URL(route, this.apiHostUrl);
        return url.href;
    }

    private getErrorResponse(response: Response) : ErrorResponse {
        return {
            error_detail : "An unexpected error has occured.",
            error_title : "Error",
            error_code : {
                description: response.statusText,
                value : response.status
            }
        };
    }

    private getUnexpectedError() : ErrorResponse {
        return {
            error_detail : "An unexpected error has occured.",
            error_title : "Error",
            error_code : {
                description: "",
                value : 0
            }
        };
    }

    login(model: LoginModel) {
        const getTokenUrl = this.getApiUrl("/auth/token");
        return fetch(getTokenUrl, {
            method: HttpMethod.POST,
            headers: this.getHeaders(),
            body: JSON.stringify(model)
        }).then(async (response) => {
            switch (response.status) {
                case HttpStatusCode.OK:
                    return await response.json() as TokenResponse;
                case HttpStatusCode.NOT_FOUND:
                case HttpStatusCode.BAD_REQUEST:
                    return await response.json() as ErrorResponse;
                default:
                    return this.getErrorResponse(response);
            }
        }).catch((error) => {
           console.error(error);
           return this.getUnexpectedError();
        });
    }

}