import { statusToString } from '../api/httpHelpers';

export const logAndFormatError = (error: any): string => {
    console.error(error);
    if (error instanceof Response) {
        return `An unexpected error occurred. Please try again later. ${statusToString(error)}`;
    } else {
        return `An unexpected error occurred. Please try again later. ${error}`;
    }
};
