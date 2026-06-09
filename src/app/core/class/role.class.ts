export interface RoleBase{
    roleId      : number;
    roleName    : string;
    status      : number;
}

export interface RoleRequest{
    roleName    : string;
    status?     : number;
}