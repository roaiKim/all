import { UserService$getUser$Response } from "./service";

export interface State {
    name: string;
    profile: UserService$getUser$Response | null;
    confirmPassword: boolean;
}
