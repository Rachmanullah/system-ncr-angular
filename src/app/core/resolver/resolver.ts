import { ResolveFn } from "@angular/router";
import { UserBase } from "../class/user.class";
import { UserService } from "../../service/user.service";
import { inject } from "@angular/core";
import { catchError, map, of } from "rxjs";
import { RoleBase } from "../class/role.class";
import { RoleService } from "../../service/role.service";
import { DepartmentBase } from "../class/department.class";
import { DepartmentService } from "../../service/department.service";
import { MenuBase } from "../class/menu.class";
import { MenuService } from "../../service/menu.service";
import { RoleMenuService } from "../../service/rolemenu.service";
import { RoleMenuBase } from "../class/roleMenu.class";
import { NCRMatrixBase } from "../class/matrix.class";
import { NCRMatrixApprovalService } from "../../service/matrixApproval.service";
import { NCRBase } from "../class/ncr.class";
import { NCRService } from "../../service/ncr.service";
import { InboxService } from "../../service/inbox.service";
import { InboxBase } from "../class/inbox.class";
import { PermissionBase } from "../class/permission.class";
import { PermissionService } from "../../service/permission.service";

export const userResolver: ResolveFn<UserBase[]> = (route, state) => {
    const service = inject(UserService);
    return service.getAllUser().pipe(
        map(res => res.data ?? []),
        catchError(() => of([]))
    );
}

export const roleResolver: ResolveFn<RoleBase[]> = (route, state) => {
    const service = inject(RoleService);
    return service.getAllRole().pipe(
        map(res => res.data ?? []),
        catchError(() => of([]))
    );
}

export const departmentResolver: ResolveFn<DepartmentBase[]> = (route, state) => {
    const service = inject(DepartmentService);
    return service.getAllDepartment().pipe(
        map(res => res.data ?? []),
        catchError(() => of([]))
    );
}

export const menuResolver: ResolveFn<MenuBase[]> = (route, state) => {
    const service = inject(MenuService);
    return service.getAllMenu().pipe(
        map(res => res.data ?? []),
        catchError(() => of([]))
    );
};

export const roleMenuResolver: ResolveFn<RoleMenuBase[]> = (route, state) => {
    const service = inject(RoleMenuService);
    return service.getAllRoleMenu().pipe(
        map(res => res.data ?? []),
        catchError(() => of([]))
    );
};

export const matrixApprovalResolver: ResolveFn<NCRMatrixBase[]> = (route, state) => {
    const service = inject(NCRMatrixApprovalService);
    return service.getAllMatrix().pipe(
        map(res => res.data ?? []),
        catchError(() => of([]))
    );
}

export const ncrResolver: ResolveFn<NCRBase[]> = (route, state) => {
    const service = inject(NCRService);
    return service.getAllNcr().pipe(
        map(res => res.data ?? []),
        catchError(() => of([]))
    );
}

export const inboxResolver: ResolveFn<InboxBase[]> = (route, state) => {
    const service = inject(InboxService);
    return service.getAllNcrNeedApprove().pipe(
        map(res => res.data ?? []),
        catchError(() => of([]))
    );
}

export const permissionResolver: ResolveFn<PermissionBase[]> = (route, state) => {
    const service = inject(PermissionService);
    return service.getAllPermission().pipe(
        map(res => res.data ?? []),
        catchError(() => of([]))
    );
}