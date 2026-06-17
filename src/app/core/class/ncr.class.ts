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
    ncrDetail               : NCRDetailBase;
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
    detail                  : NCRDetailRequest;
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