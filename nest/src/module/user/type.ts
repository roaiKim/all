export interface RoResponse<T> {
    code: number;
    message: string;
    data: T;
}

export interface UserGetUserResponse {
    name: string;
}

export interface UserGetUserRequest {
    name: string;
    password: string;
}

export interface UserUpdateUserRequest {
    name: string;
    id: string;
}

export interface PageLimitResponse<T> {
    list: T[];
    totalRecord: number;
}
