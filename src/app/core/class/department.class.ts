export interface DepartmentBase{
    departmentId    : number;
    departmentCode  : string;
    departmentName  : string;
    status          : number;
}

export interface DepartmentRequest{
    departmentCode  : string;
    departmentName  : string;
    status?         : number;
}