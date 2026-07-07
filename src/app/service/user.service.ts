import { HttpClient } from "@angular/common/http";
import { BaseApiService } from "../core/http/baseApi.service";
import { UserRequest, UpdateUserRequest, UserBase } from "../core/class/user.class";
import { ApiResponse } from "../core/http/apiResponse.class";
import { Observable } from "rxjs";
import { ApiMessageResponse } from "../core/http/apiMessageResponse";
import { Injectable } from "@angular/core";
@Injectable({ providedIn: 'root' })
export class UserService extends BaseApiService{
    private endpoint = `${this.apiUrl}/system/users`;

    constructor(http: HttpClient) {
        super(http);
    }
    getAllUser(): Observable<ApiResponse<UserBase[]>> {
        return this.http.get<ApiResponse<UserBase[]>>(this.endpoint);
    }

    createUser(
        payload: UserRequest
    ): Observable<ApiMessageResponse> {
        return this.http.post<ApiMessageResponse>(this.endpoint,payload);
    }

    updateUser(
        userId: number,
        payload: UserRequest
    ): Observable<ApiMessageResponse> {
        return this.http.put<ApiMessageResponse>(
            `${this.endpoint}/${userId}`,payload);
    }

    deleteUser(
        userId: number
    ): Observable<ApiMessageResponse> {
        return this.http.delete<ApiMessageResponse>(
            `${this.endpoint}/${userId}`);
    }
}