export const PERMISSIONS = {
  CREATE_NCR: "CREATE_NCR",
  UPDATE_NCR: "UPDATE_NCR",
  DELETE_NCR: "DELETE_NCR",
  SUBMIT_NCR: "SUBMIT_NCR",
  CLOSE_NCR: "CLOSE_NCR",
  APPROVE_NCR: "APPROVE_NCR",
  REJECT_NCR: "REJECT_NCR",
  CRUD_BRD: "CRUD_BRD",
  CRUD_PRD: "CRUD_PRD",
  CRUD_MOM: "CRUD_MOM",
  ASSIGN: "ASSIGN",
  UAT: "UAT",
  DEPLOYMENT: "DEPLOYMENT",
} as const;

export interface PermissionOption {
    label: string;
    value: string;
}
export const PERMISSION: PermissionOption[] = [
    {
        label: "Create NCR",
        value: PERMISSIONS.CREATE_NCR,
    },
    {
        label: "Update NCR",
        value: PERMISSIONS.UPDATE_NCR,
    },
    {
        label: "Delete NCR",
        value: PERMISSIONS.DELETE_NCR,
    },
    {
        label: "Submit NCR",
        value: PERMISSIONS.SUBMIT_NCR,
    },
    {
        label: "Close NCR",
        value: PERMISSIONS.CLOSE_NCR,
    },
    {
        label: "Approve NCR",
        value: PERMISSIONS.APPROVE_NCR,
    },
    {
        label: "Reject NCR",
        value: PERMISSIONS.REJECT_NCR,
    },
    {
        label: "CRUD BRD",
        value: PERMISSIONS.CRUD_BRD,
    },
    {
        label: "CRUD PRD",
        value: PERMISSIONS.CRUD_PRD,
    },
    {
        label: "CRUD MOM",
        value: PERMISSIONS.CRUD_MOM,
    },
    {
        label: "Assign",
        value: PERMISSIONS.ASSIGN,
    },
    {
        label: "UAT",
        value: PERMISSIONS.UAT,
    },
    {
        label: "Deployment",
        value: PERMISSIONS.DEPLOYMENT,
    },
];