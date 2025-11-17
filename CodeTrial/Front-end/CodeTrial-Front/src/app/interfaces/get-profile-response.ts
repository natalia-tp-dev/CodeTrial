import { User } from "./user";

export interface GetProfileResponse {
    message: string,
    isLogged: boolean,
    user: User
}
