export interface RoleMenuBase{
    roleMenuId: number;
    roleId: number;
    roleName: string;
    menuId: number;
    menuTitle: string;
    status: number
    deleted: number;
}

export interface RoleMenuRequest{
    roleId: number;
    menuId: number;
    status: number;
}