export interface ApproverBase {
    approverId              : number;
    approverName            : string;
    approverPosition        : string;
    orderNumber             : string;
    approveToOrderNumber?   : number;
    rejectToOrderNumber?    : number;
}

export interface ApproverRequest {
    approverId          : number;
    orderNumber         : number;
    approveToOrderNumber?   : number;
    rejectToOrderNumber?    : number;
}