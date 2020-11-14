export interface TokenResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
}

export interface UserResponse {
    id: number;
    name: string;
    email: string;
    date_created: string; //TODO: convert to timestamp? we probably dont need this so atm its fine
}

export interface ErrorCode {
    value: number;
    description: string;
}

export interface ErrorResponse {
    error_code: ErrorCode;
    error_title: string;
    error_detail: string;
}

export const isErrorResponse = (response: UserResponse | TokenResponse | ErrorResponse): response is ErrorResponse => {
    return (response as ErrorResponse).error_code !== undefined;
}