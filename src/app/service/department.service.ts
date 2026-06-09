import { HttpClient } from '@angular/common/http';
import { BaseApiService } from '../core/http/baseApi.service';
import { Observable } from 'rxjs';
import { ApiResponse } from '../core/http/apiResponse.class';
import { DepartmentBase, DepartmentRequest } from '../core/class/department.class';
import { ApiMessageResponse } from '../core/http/apiMessageResponse';
import { Injectable } from '@angular/core';
@Injectable({ providedIn: 'root' })
export class DepartmentService extends BaseApiService {
    private endpoint = `${this.apiUrl}/master/departments`;

    constructor(http: HttpClient) {
        super(http);
    }

    getAllDepartment(): Observable<ApiResponse<DepartmentBase[]>> {
        return this.http.get<ApiResponse<DepartmentBase[]>>(this.endpoint);
    }

    createDepartment(payload: DepartmentRequest): Observable<ApiMessageResponse> {
        return this.http.post<ApiMessageResponse>(this.endpoint, payload);
    }

    updateDepartment(departmentId: number, payload: DepartmentRequest): Observable<ApiMessageResponse> {
        return this.http.put<ApiMessageResponse>(`${this.endpoint}/${departmentId}`, payload);
    }

    deleteDepartment(departmentId: number): Observable<ApiMessageResponse> {
        return this.http.delete<ApiMessageResponse>(`${this.endpoint}/${departmentId}`);
    }
}
