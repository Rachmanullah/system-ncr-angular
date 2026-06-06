export interface AuthBase {
    id?: number;
    name: string;
    username: string;
    token?: string;
}

export interface AuthRequest {
    username: string;
    password: string;
}