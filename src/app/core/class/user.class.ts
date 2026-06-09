import { DepartmentBase } from "./department.class";
import { RoleBase } from "./role.class";

export interface UserBase {
    userId      : number;
    username    : string;
    fullname    : string;
    email?      : string;
    position?   : string;
    status?     : number;
    department  : DepartmentBase;
    role        : RoleBase;
}

export interface UserRequest {
    username    : string;
    password?   : string;
    fullname    : string;
    email?      : string;
    position?   : string;
    roleId      : number;
    departmentId: number;
}

export interface UpdateUserRequest {
    userId      : number;
    username?   : string;
    password?   : string;
    fullname?   : string;
    email?      : string;
    position?   : string;
    roleId      : number;
    departmentId: number;
}
