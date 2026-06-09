export interface RoleMenuBase{
    roleMenuId: number;
    roleId: string;
    menuId?: number | null;
    titleMenu?: string | null;
    deleted?: number | null;
}

export interface RoleMenuRequest{
    roleId: string;
    menuId?: number;
}