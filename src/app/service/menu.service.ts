import { Injectable } from "@angular/core";
import { BaseApiService } from "../core/http/baseApi.service";
import { BehaviorSubject, Observable } from "rxjs";
import { MenuBase, MenuItem, MenuRequest } from "../core/class/menu.class";
import { HttpClient } from "@angular/common/http";
import { AuthService } from "./auth.service";
import { ApiResponse } from "../core/http/apiResponse.class";
import { ApiMessageResponse } from "../core/http/apiMessageResponse";

@Injectable({ providedIn: 'root' })
export class MenuService extends BaseApiService {
    private endpoint = `${this.apiUrl}/layout/menu`;

    private menuSubject = new BehaviorSubject<MenuItem[]>([]);
    menus$ = this.menuSubject.asObservable();

    constructor(
        http: HttpClient,
        private authService: AuthService
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
}