import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApiService } from '../core/http/baseApi.service';
import { RoleBase, RoleRequest } from '../core/class/role.class';
import { ApiResponse } from '../core/http/apiResponse.class';
import { ApiMessageResponse } from '../core/http/apiMessageResponse';

@Injectable({ providedIn: 'root' })
export class RoleService extends BaseApiService {

    private endpoint = `${this.apiUrl}/master/roles`;

    constructor(http: HttpClient) {
        super(http);
    }

    getAllRole(): Observable<ApiResponse<RoleBase[]>> {
        return this.http.get<ApiResponse<RoleBase[]>>(this.endpoint);
    }

    createRole(
        payload: RoleRequest
    ): Observable<ApiMessageResponse> {
        return this.http.post<ApiMessageResponse>(this.endpoint,payload);
    }

    updateRole(
        roleId: number,
        payload: RoleRequest
    ): Observable<ApiMessageResponse> {
        return this.http.put<ApiMessageResponse>(
            `${this.endpoint}/${roleId}`, payload);
    }

    deleteRole(
        roleId: number
    ): Observable<ApiMessageResponse> {
        return this.http.delete<ApiMessageResponse>(
            `${this.endpoint}/${roleId}`);
    }
}
