import { UserResponse } from '../../api/__generated__';

export interface IUserProps {
    authenticatedUser: UserResponse | null;
}
