import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './layouts/auth/auth-layout.component';
import { LoginComponent } from './pages/auth/login.component';
import { MainLayoutComponent } from './layouts/main/main-layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { UsersComponent } from './pages/user/user.component';
import { departmentResolver, matrixApprovalResolver, menuResolver, ncrResolver, roleMenuResolver, roleResolver, userResolver } from './core/resolver/resolver';
import { RoleComponent } from './pages/role/role.component';
import { DepartmentComponent } from './pages/department/department.component';
import { MenuComponent } from './pages/menu/menu.component';
import { RoleMenuComponent } from './pages/rolemenu/rolemenu.component';
import { authGuard } from './core/guard/auth.guard';
import { guestGuard } from './core/guard/guest.guard';
import { NCRMatrixApprovalComponent } from './pages/ncrMatrixApproval/matrixApproval.component';
import { NCRComponent } from './pages/ncr/ncr.component';

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
        ]
    },
    {
        path: 'system',
        component: MainLayoutComponent,
        canActivate: [authGuard],
        children: [
            { path: 'users', component: UsersComponent, resolve: { userData: userResolver, roleData: roleResolver, departmentData: departmentResolver } },
            { path: 'roles', component: RoleComponent, resolve: { roleData: roleResolver } },
            { path: 'menus', component: MenuComponent, resolve: { menuData: menuResolver } },
            { path: 'rolemenu', component: RoleMenuComponent, resolve: { roleMenuData: roleMenuResolver, roleData: roleResolver, menuData: menuResolver } },
        ]
    },
    {
        path: 'master',
        component: MainLayoutComponent,
        canActivate: [authGuard],
        children: [
            { path: 'departments', component: DepartmentComponent, resolve: { departmentData: departmentResolver } },
        ]
    },
    {
        path: 'ncr',
        component: MainLayoutComponent,
        canActivate: [authGuard],
        children: [
            { path: 'list', component: NCRComponent, resolve: { ncrData: ncrResolver} },
            { path: 'matrix', component: NCRMatrixApprovalComponent, resolve: { matrixApprovalData: matrixApprovalResolver, userData: userResolver, departmentData: departmentResolver } },
        ]
    }
];
