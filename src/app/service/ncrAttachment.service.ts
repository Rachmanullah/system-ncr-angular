// ncrAttachment.service.ts
import { Injectable } from "@angular/core";
import { BaseApiService } from "../core/http/baseApi.service";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { ApiResponse } from "../core/http/apiResponse.class";
import { NCRAttachmentBase } from "../core/class/ncr.class";
import { ApiMessageResponse } from "../core/http/apiMessageResponse";

@Injectable({ providedIn: 'root' })
export class NCRAttachmentService extends BaseApiService {
    private endpoint = `${this.apiUrl}/ncr/attachment`;

    constructor(http: HttpClient) {
        super(http);
    }

    uploadNcrAttachment(file: File): Observable<ApiResponse<NCRAttachmentBase>> {
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post<ApiResponse<NCRAttachmentBase>>(this.endpoint, formData);
    }

    deleteNcrAttachment(ncrAttachmentId: number): Observable<ApiMessageResponse> {
        return this.http.delete<ApiMessageResponse>(`${this.endpoint}/${ncrAttachmentId}`);
    }

    downloadNcrAttachment(ncrAttachmentId: number): Observable<Blob> {
        return this.http.get(`${this.endpoint}/${ncrAttachmentId}/download`, {
            responseType: 'blob'
        });
    }
}