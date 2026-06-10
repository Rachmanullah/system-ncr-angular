import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { MenuService } from '../../service/menu.service';

export const authGuard: CanActivateFn = () => {
    const auth = inject(AuthService);
    const router = inject(Router);
    const menuService = inject(MenuService);
    if (!auth.isAuthenticated()) {
        router.navigate(['/auth/login']);
        return false;
    }

    const user = auth.getUser();
    menuService.loadMenus(user.roleId);
    return true;
};
