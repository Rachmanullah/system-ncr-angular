export interface RolePermissionBase {
    rolePermissionId: number;
    permissionId: number;
    permissionCode: string;
    status: number;
}

export interface RolePermissionRequest {
    rolePermissionId    : number;
    roleId?             : number;
    permissionId        : number;
    permissionCode      : string;
    status              : number;
}