export interface TokenResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
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