import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../../service/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const token = authService.getToken();

    const headers: any = {};

    if (!token) {
        return next(req);
    }

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    if (Object.keys(headers).length === 0) {
        return next(req);
    }

    const authReq = req.clone({
        setHeaders: headers,
    });

    return next(authReq);
};
