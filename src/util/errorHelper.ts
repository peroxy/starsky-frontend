import { statusToString } from '../api/httpHelpers';

export interface ErrorDetails {
    occurred: boolean;
    mainError: string;
    details: string;
    status: string;
}

export const getErrorDetails = async (error: any): Promise<ErrorDetails> => {
    console.error(error);
    if (error instanceof Response) {
        return {
            mainError: `An unexpected error occurred. Please try again later.`,
            details: JSON.stringify(await error.json(), null, 2),
            status: statusToString(error),
            occurred: true,
        };
    } else {
        return { mainError: `An unexpected error occurred. Please try again later.`, details: `${error}`, occurred: true, status: 'UNKNOWN STATUS' };
    }
};

export const getErrorNotOccurred = (): ErrorDetails => {
    return { mainError: '', occurred: false, details: '', status: '' };
};
