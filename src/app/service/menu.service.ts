import { Injectable } from "@angular/core";
import { BaseApiService } from "../core/http/baseApi.service";
import { BehaviorSubject, forkJoin, Observable } from "rxjs";
import { MenuBase, MenuItem, MenuRequest } from "../core/class/menu.class";
import { HttpClient } from "@angular/common/http";
import { AuthService } from "./auth.service";
import { ApiResponse } from "../core/http/apiResponse.class";
import { ApiMessageResponse } from "../core/http/apiMessageResponse";
import { RoleMenuBase } from "../core/class/roleMenu.class";
import { RoleMenuService } from "./rolemenu.service";

@Injectable({ providedIn: 'root' })
export class MenuService extends BaseApiService {
    private endpoint = `${this.apiUrl}/layout/menu`;

    private menuSubject = new BehaviorSubject<MenuItem[]>([]);
    menus$ = this.menuSubject.asObservable();

    constructor(
        http: HttpClient,
        private authService: AuthService,
        private roleMenuService: RoleMenuService
    ) {
        super(http);
    }

    getAllMenu(): Observable<ApiResponse<MenuBase[]>> {
        return this.http.get<ApiResponse<MenuBase[]>>(this.endpoint);
    }

    createMenu(payload: MenuRequest): Observable<ApiMessageResponse> {
        return this.http.post<ApiMessageResponse>(this.endpoint, payload);
    }

    updateMenu(menuId: number, payload: MenuRequest): Observable<ApiMessageResponse> {
        return this.http.put<ApiMessageResponse>(`${this.endpoint}/${menuId}`, payload);
    }

    deleteMenu(menuId: number): Observable<ApiMessageResponse> {
        return this.http.delete<ApiMessageResponse>(`${this.endpoint}/${menuId}`);
    }

    loadMenus(roleId: number) {
        console.log("Load Menu");
        forkJoin({
            menus: this.getAllMenu(),
            roleMenus: this.roleMenuService.getRoleMenuByRoleId(roleId)
        }).subscribe({
            next: ({ menus, roleMenus }) => {

                const menuTree = this.mapToMenuTree(
                    menus.data,
                    roleMenus.data
                );
                console.log("menuTree: ", menuTree);
                this.menuSubject.next(menuTree);
            }
        });
    }

    private sortMenus(menus: MenuItem[]): MenuItem[] {
        return menus.sort((a, b) => {
            if (a.title === 'Dashboard') return -1;
            if (b.title === 'Dashboard') return 1;

            const aHasChildren = !!a.children?.length;
            const bHasChildren = !!b.children?.length;

            if (!aHasChildren && bHasChildren) return -1;
            if (aHasChildren && !bHasChildren) return 1;

            return a.title.localeCompare(b.title);
        });
    }

    private mapToMenuTree(
        menus: MenuBase[],
        roleMenus: RoleMenuBase[]
    ): MenuItem[] {

        const allowedMenuIds = new Set<number>(
            roleMenus
                .filter(r => r.status === 0)
                .map(r => r.menuId)
        );

        const menuMap = new Map<number, MenuItem>();

        menus.forEach(menu => {

            if (
                menu.deleted === 1 ||
                !allowedMenuIds.has(menu.menuId)
            ) {
                return;
            }

            menuMap.set(menu.menuId, {
                menuId: menu.menuId,
                title: menu.menuTitle,
                icon: menu.menuIcon ?? undefined,
                url: menu.menuRoute ?? undefined,
                children: []
            });
        });

        const roots: MenuItem[] = [];

        menus.forEach(menu => {

            if (!allowedMenuIds.has(menu.menuId)) {
                return;
            }

            const current = menuMap.get(menu.menuId);

            if (!current) {
                return;
            }

            if (menu.menuParentId) {

                const parent = menuMap.get(menu.menuParentId);

                if (parent) {
                    parent.children ??= [];
                    parent.children.push(current);
                }
            } else {

                roots.push(current);
            }
        });

        roots.forEach(menu => {
            if (!menu.children?.length) {
                delete menu.children;
            }
        });

        return this.sortMenus(roots);
    }
}