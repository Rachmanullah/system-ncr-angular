export interface NCRBase {
    ncrId                   : number;
    ncrNumber               : string;
    ncrDate                 : string;
    ncrTitle                : string;
    ncrProject              : string;
    ncrCategory             : string;
    requestorId             : number;
    requestorName           : string;
    departmentId            : number;
    departmentName          : string;
    ncrImplementationDate   : string;
    implementationId        : number;
    implementationName      : string;
    statusCode              : string;
    statusName              : string;
    runningNumber           : number;
    approver?               : number;
    ncrDetail               : NCRDetailBase;
    ncrAttachment?          : NCRAttachmentBase[];
    ncrLogs                 : NCRLogsBase[];
}

export interface NCRDetailBase {
    ncrDetailId             : number;
    description             : string;
    priority                : string;
    asIs                    : string;
    toBe                    : string;
    benefit                 : string;
    impact                  : string;
    financialImpact         : string;
}


export interface NCRRequest {
    ncrTitle                : string;
    ncrNumber               : string;
    ncrProject              : string;
    ncrDate                 : string;
    ncrImplementationDate?  : string;
    ncrCategory             : string;
    requestorId             : number;
    requestorName?          : string;
    departmentId            : number;
    departmentName?         : string;
    implementationId?       : number;
    action                  : string;
    statusCode              : string;
    statusName              : string;
    approver?               : number;
    detail                  : NCRDetailRequest;
    attachment?             : NCRAttachmentRequest[];
}

export interface NCRDetailRequest {
    description             : string;
    priority                : string;
    asIs                    : string;
    toBe                    : string;
    benefit                 : string;
    impact                  : string;
    financialImpact         : string;    
}

export interface NCRLogsBase {
    ncrLogsId?               : number;
    orderNumber?             : number;
    statusName?              : string;
    notes?                   : string;
    date?                    : string;
    username?                : string;
    userPosition?            : string;
}

export interface NCRAttachmentBase{
    ncrAttachmentId         : number;
    ncrId?                  : number;
    fileName                : string;
    fileSize                : number;
    originalFileName        : string;
    created                 : string;
}

export interface NCRAttachmentRequest {
    ncrAttachmentId: number;
}