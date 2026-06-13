export interface ApproverBase {
    approverId          : number;
    approverName        : string;
    approverPosition    : string;
    orderNumber         : string;
}

export interface ApproverRequest {
    approverId          : number;
    orderNumber         : number;
}