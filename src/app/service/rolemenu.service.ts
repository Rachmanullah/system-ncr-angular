import { Injectable } from "@angular/core";
import { BaseApiService } from "../core/http/baseApi.service";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { ApiResponse } from "../core/http/apiResponse.class";
import { RoleMenuBase, RoleMenuRequest } from "../core/class/roleMenu.class";
import { ApiMessageResponse } from "../core/http/apiMessageResponse";

@Injectable({ providedIn: 'root' })
export class RoleMenuService extends BaseApiService {
    private endpoint = `${this.apiUrl}/settings/rolemenu`;

    constructor(http: HttpClient) {
        super(http);
    }

    getAllRoleMenu(): Observable<ApiResponse<RoleMenuBase[]>> {
        return this.http.get<ApiResponse<RoleMenuBase[]>>(this.endpoint);
    }

    getRoleMenuByRoleId(
        roleId: number
    ): Observable<ApiResponse<RoleMenuBase[]>>{
        return this.http.get<ApiResponse<RoleMenuBase[]>>(`${this.endpoint}/${roleId}`);
    }

    createRoleMenu(
        payload: RoleMenuRequest
    ): Observable<ApiMessageResponse> {
        return this.http.post<ApiMessageResponse>(this.endpoint, payload);
    }

    updateRoleMenu(
        roleId: number,
        payload: RoleMenuRequest
    ): Observable<ApiMessageResponse> {
        return this.http.put<ApiMessageResponse>(
            `${this.endpoint}/${roleId}`, payload);
    }

    deleteRoleMenu(
        roleId: number
    ): Observable<ApiMessageResponse> {
        return this.http.delete<ApiMessageResponse>(
            `${this.endpoint}/${roleId}`);
    }
}