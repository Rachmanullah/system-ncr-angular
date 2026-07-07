export interface PermissionBase {
    permissionId            : number;
    permissionCode          : string;
    permissionDescription   : string;
    isActive                : number;
}

export interface PermissionRequest {
    permissionCode          : string;
    permissionDescription   : string;
    isActive                : number;
}