import { NCRDetailBase, NCRDetailRequest, NCRLogsBase } from "./ncr.class";

export interface InboxBase {
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
    approver                : number;
    approverNotes           : string;
    ncrDetail               : NCRDetailBase;
    ncrLogs                 : NCRLogsBase[];
}

export interface InboxRequest {
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
    runningNumber           : number;
    approver                : number;
    approverNotes           : string;
    detail                  : NCRDetailRequest;
}