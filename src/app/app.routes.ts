import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './layouts/auth/auth-layout.component';
import { LoginComponent } from './pages/auth/login.component';
import { MainLayoutComponent } from './layouts/main/main-layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { UsersComponent } from './pages/user/user.component';
import { departmentResolver, menuResolver, roleMenuResolver, roleResolver, userResolver } from './core/resolver/resolver';
import { RoleComponent } from './pages/role/role.component';
import { DepartmentComponent } from './pages/department/department.component';
import { MenuComponent } from './pages/menu/menu.component';
import { RoleMenuComponent } from './pages/rolemenu/rolemenu.component';
import { authGuard } from './core/guard/auth.guard';
import { guestGuard } from './core/guard/guest.guard';

export const routes: Routes = [
    {
        path: 'auth',
        component: AuthLayoutComponent,
        canActivate: [guestGuard],
        children: [
            {
                path: 'login', component: LoginComponent
            }
        ]
    },
    {
        path: '',
        component: MainLayoutComponent,
        canActivate: [authGuard],
        children: [
            { path: 'dashboard', component: DashboardComponent },
            { path: 'master/users', component: UsersComponent, resolve: { userData: userResolver, roleData: roleResolver, departmentData: departmentResolver } },
            { path: 'master/roles', component: RoleComponent, resolve: { roleData: roleResolver } },
            { path: 'master/departments', component: DepartmentComponent, resolve: { departmentData: departmentResolver } },
            { path: 'master/menus', component: MenuComponent, resolve: { menuData: menuResolver } },
            { path: 'master/rolemenu', component: RoleMenuComponent, resolve: { roleMenuData: roleMenuResolver, roleData: roleResolver, menuData: menuResolver} },
        ]
    }
];
