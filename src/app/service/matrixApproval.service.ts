import { Injectable } from "@angular/core";
import { BaseApiService } from "../core/http/baseApi.service";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { ApiResponse } from "../core/http/apiResponse.class";
import { NCRMatrixBase, NCRMatrixRequest } from "../core/class/matrix.class";
import { ApiMessageResponse } from "../core/http/apiMessageResponse";

@Injectable({ providedIn: 'root' })
export class NCRMatrixApprovalService extends BaseApiService {
    private endpoint = `${this.apiUrl}/master/matrix`;

    constructor(http: HttpClient) {
        super(http);
    }

    getAllMatrix(): Observable<ApiResponse<NCRMatrixBase[]>> {
        return this.http.get<ApiResponse<NCRMatrixBase[]>>(this.endpoint);
    }

    createMatrix(payload: NCRMatrixRequest): Observable<ApiMessageResponse> {
        return this.http.post<ApiMessageResponse>(this.endpoint, payload);
    }

    updateMatrix(matrixId: number, payload: NCRMatrixRequest): Observable<ApiMessageResponse> {
        return this.http.put<ApiMessageResponse>(`${this.endpoint}/${matrixId}`, payload);
    }

    deleteMatrix(matrixId: number): Observable<ApiMessageResponse> {
        return this.http.delete<ApiMessageResponse>(`${this.endpoint}/${matrixId}`);
    }
}