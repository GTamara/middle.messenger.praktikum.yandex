// Swagger types

export interface SignUpRequest {
    first_name: string;
    second_name: string;
    login: string;
    email: string;
    password: string;
    phone: string;
}

export interface SignUpResponse {
    id: number;
}

export interface SignInRequest {
    login: string;
    password: string;
}

export interface UserResponse {
    id: number;
    first_name: string;
    second_name: string;
    display_name: string;
    login: string;
    email: string;
    phone: string;
    avatar: string;
}

export interface UserUpdateRequest {
    first_name: string;
    second_name: string;
    display_name: string;
    login: string;
    email: string;
    phone: string;
}

export interface ChangePasswordRequest {
    oldPassword: string;
    newPassword: string;
}

export interface UsersRequest {
    users: number[];
    chatId: number;
}

// export interface AddUserResponse {
//     id: number;
// }

export interface CreateChatRequest {
    title: string;
}

export interface CreateChatResponse {
    id: number;
}
