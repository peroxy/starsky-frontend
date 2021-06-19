import {LoginModel, RegisterModel} from "./models";
import {HttpMethod} from "./httpMethod";
import {env} from "../util/envHelper";
import {HttpStatusCode} from "./httpStatusCode";
import {ErrorResponse, TokenResponse, UserResponse} from "./responses";

export class StarskyApiClient {
    private readonly apiBaseUrl : string
    constructor() {
        this.apiBaseUrl = env("REACT_APP_BACKEND_HOST");
    }

    private getNonAuthenticatedHeader(){
        return {
            "Content-Type": "application/json"
        };
    }

    private getAuthenticatedHeaders(token : string){
        return {
            "Content-Type": "application/json",
            "Authorization" : `Bearer ${token}`
        };
    }

    private getApiUrl(route: string){
        const url : URL = new URL(route, this.apiBaseUrl);
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

    /**
     * Try to login to Starsky API by retrieving a JWT bearer token
     * @param model Credentials for API
     */
    login(model: LoginModel) {
        const getTokenUrl = this.getApiUrl("/auth/token");
        return fetch(getTokenUrl, {
            method: HttpMethod.POST,
            headers: this.getNonAuthenticatedHeader(),
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

    /**
     * Try to call register method of Starsky API.
     * @param model Credentials for new user
     */
    register(model: RegisterModel) {
        const registerUrl = this.getApiUrl("/users/");
        return fetch(registerUrl, {
            method: HttpMethod.POST,
            headers: this.getNonAuthenticatedHeader(),
            body: JSON.stringify(model)
        }).then(async (response) => {
            switch (response.status) {
                case HttpStatusCode.OK:
                    return await response.json() as UserResponse;
                case HttpStatusCode.CONFLICT:
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

    /**
     * Get user for specified token
     */
    getUser(token: string) {
        const getUserUrl = this.getApiUrl("/user/");
        return fetch(getUserUrl, {
            method: HttpMethod.GET,
            headers: this.getAuthenticatedHeaders(token)
        }).then(async (response) => {
            switch (response.status) {
                case HttpStatusCode.OK:
                    return await response.json() as UserResponse;
                case HttpStatusCode.NOT_FOUND:
                    return await response.json() as ErrorResponse;
                default:
                    return this.getErrorResponse(response);
            }
        }).catch((error) => {
            console.error(error);
            return this.getUnexpectedError();
        });
    }

    /**
     * Validate a JWT token by sending an authenticated GET request
     * @param token JWT token for Starsky API
     */
    validateToken(token : string) {
        console.log("validating token called...")
        const validateUrl = this.getApiUrl("/auth/token/validate");
        return fetch(validateUrl, {
            method: HttpMethod.GET,
            headers: this.getAuthenticatedHeaders(token)
        }).then(async (response) => {
            switch (response.status) {
                case HttpStatusCode.OK:
                    return true;
                default:
                    return false;
            }
        }).catch((error) => {
            console.error(error);
            return false;
        });
    }

}