import { UserService$getUser$Response } from "@api/UserService";

export interface State {
    name: string;
    profile: UserService$getUser$Response | null;
    validatePassword: boolean;
}
