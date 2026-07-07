import { RolePermissionBase, RolePermissionRequest } from "./rolePermission.class";

export interface RoleBase{
    roleId          : number;
    roleName        : string;
    status          : number;
    rolePermission  : RolePermissionBase[];
}

export interface RoleRequest{
    roleName        : string;
    status?         : number;
    rolePermission  : RolePermissionRequest[];
}