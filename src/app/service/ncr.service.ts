import { Injectable } from "@angular/core";
import { BaseApiService } from "../core/http/baseApi.service";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { ApiResponse } from "../core/http/apiResponse.class";
import { NCRBase, NCRRequest } from "../core/class/ncr.class";
import { ApiMessageResponse } from "../core/http/apiMessageResponse";

@Injectable({ providedIn: 'root' })
export class NCRService extends BaseApiService {
    private endpoint = `${this.apiUrl}/ncr`;

    constructor(http: HttpClient) {
        super(http);
    }

    getAllNcr(): Observable<ApiResponse<NCRBase[]>> {
        return this.http.get<ApiResponse<NCRBase[]>>(this.endpoint);
    }

    createNcr(payload: NCRRequest): Observable<ApiMessageResponse> {
        return this.http.post<ApiResponse<ApiMessageResponse>>(this.endpoint, payload);
    }

    updateNcr(ncrId: number, payload: NCRRequest): Observable<ApiMessageResponse> {
        return this.http.put<ApiMessageResponse>(`${this.endpoint}/${ncrId}`, payload);
    }

    deleteNcr(ncrId: number): Observable<ApiMessageResponse> {
        return this.http.delete<ApiMessageResponse>(`${this.endpoint}/${ncrId}`);
    }
}