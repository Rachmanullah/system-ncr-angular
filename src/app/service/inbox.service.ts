import { Injectable } from "@angular/core";
import { BaseApiService } from "../core/http/baseApi.service";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { ApiResponse } from "../core/http/apiResponse.class";
import { ApiMessageResponse } from "../core/http/apiMessageResponse";
import { InboxBase, InboxRequest } from "../core/class/inbox.class";

@Injectable({ providedIn: 'root' })

export class InboxService extends BaseApiService {
    private endpoint = `${this.apiUrl}/inbox`;

    constructor(http: HttpClient) {
        super(http);
    }

    getAllNcrNeedApprove(): Observable<ApiResponse<InboxBase[]>> {
        return this.http.get<ApiResponse<InboxBase[]>>(this.endpoint);
    }

    approveNcr(payload: InboxRequest): Observable<ApiMessageResponse> {
        return this.http.post<ApiResponse<ApiMessageResponse>>(`${this.endpoint}/approve`, payload);
    }

    rejectNcr(payload: InboxRequest): Observable<ApiMessageResponse> {
        return this.http.post<ApiResponse<ApiMessageResponse>>(`${this.endpoint}/reject`, payload);
    }
}