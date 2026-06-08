import { Injectable } from "@angular/core";
import { BaseApiService } from "../core/http/baseApi.service";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { ApiMessageResponse } from "../core/http/apiMessageResponse";
import { AuthRequest } from "../core/class/auth.class";

@Injectable({ providedIn: 'root' })
export class AuthService extends BaseApiService{
    private endpoint = `${this.apiUrl}/auth`;

    constructor(http: HttpClient) {
        super(http);
    }

    private userSubject = new BehaviorSubject<any>(this.getUser());
    user$ = this.userSubject.asObservable();

    AuthLogin(
        payload: AuthRequest
    ): Observable<ApiMessageResponse> {
        return this.http.post<ApiMessageResponse>(
            `${this.endpoint}/login`,
            payload
        );
    }

    isAuthenticated(): boolean {
        if (typeof window === 'undefined') return false;

        const token = localStorage.getItem('token');
        const tokenExpiredAt = localStorage.getItem('token_expiredAt');
        const server = localStorage.getItem('targetServer');

        if(!token || !tokenExpiredAt || !server) return false;

        const now = Math.floor(Date.now() / 1000);

        if(now > +tokenExpiredAt){
            this.logout();
            return false;
        }
        return true;
    }
    
    saveAuth(data: any) {
        const token = data.token;

        const payload = JSON.parse(atob(token.split('.')[1]));
        const exp = payload.exp * 1000;
        console.log("data : ", data);
        console.log("token payload : ", payload);
        const userData = {
            "userId": payload.userId,
            "username": payload.sub,
            "fullname": payload.fullname,
            "email" : payload.email,
            "position": payload.position,
            "departmentId": payload.departmentId,
            "departmentName": payload.departmentName,
            "roleId": payload.roleId,
            "roleName": payload.roleName
        };
        console.log("userData :", JSON.stringify(userData));
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', data.token);
        localStorage.setItem('token_expiredAt', exp.toString());
        
        this.userSubject.next(userData);
    }

    logout() {
        localStorage.clear();
    }

    getUser() {
        if (typeof window === 'undefined') return null;

        const raw = localStorage.getItem('user');
        if (!raw) return null;

        try {
            return JSON.parse(raw);
        } catch {
            return null;
        }
    }

    getToken() {
        return localStorage.getItem('token');
    }
}