export interface AuthBase {
    userId?: number;
    fullname: string;
    username: string;
    email?: string;
    position?: string;
    departmentId?: number;
    departmentName?: string;
    roleId?: number;
    roleName?: string;
    token?: string;
}

export interface AuthRequest {
    username: string;
    password: string;
}