import { ApproverBase, ApproverRequest } from "./approver.class";

export interface NCRMatrixBase {
    ncrMatrixId         : number;
    ncrMatrixCode       : string;
    departmentId        : number;
    departmentCode      : string;
    departmentName      : string;
    approver            : ApproverBase[];
    status              : number;
}


export interface NCRMatrixRequest {
    ncrMatrixCode       : string;
    departmentId        : number;
    approver            : ApproverRequest[];
    status              : number;
}