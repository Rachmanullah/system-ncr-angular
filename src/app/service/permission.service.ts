import { Injectable } from "@angular/core";
import { BaseApiService } from "../core/http/baseApi.service";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { ApiResponse } from "../core/http/apiResponse.class";
import { PermissionBase, PermissionRequest } from "../core/class/permission.class";
import { ApiMessageResponse } from "../core/http/apiMessageResponse";


@Injectable({ providedIn: 'root' })

export class PermissionService extends BaseApiService {
    private endpoint = `${this.apiUrl}/settings/permission`;

    constructor(http: HttpClient) {
        super(http);
    }

    getAllPermission(): Observable<ApiResponse<PermissionBase[]>> {
        return this.http.get<ApiResponse<PermissionBase[]>>(this.endpoint);
    }

    createPermission(
        payload: PermissionRequest
    ): Observable<ApiMessageResponse> {
        return this.http.post<ApiMessageResponse>(this.endpoint, payload);
    }

    updatePermission(
        permissionId: number,
        payload: PermissionRequest
    ): Observable<ApiMessageResponse> {
        return this.http.put<ApiMessageResponse>(
            `${this.endpoint}/${permissionId}`, payload);
    }

    deletePermission(
        permissionId: number
    ): Observable<ApiMessageResponse> {
        return this.http.delete<ApiMessageResponse>(
            `${this.endpoint}/${permissionId}`);
    }
}