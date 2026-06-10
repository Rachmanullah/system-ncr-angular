import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './layouts/auth/auth-layout.component';
import { LoginComponent } from './pages/auth/login.component';
import { MainLayoutComponent } from './layouts/main/main-layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { UsersComponent } from './pages/user/user.component';
import { departmentResolver, menuResolver, roleResolver, userResolver } from './core/resolver/resolver';
import { RoleComponent } from './pages/role/role.component';
import { DepartmentComponent } from './pages/department/department.component';
import { MenuComponent } from './pages/menu/menu.component';

export const routes: Routes = [
    {
        path: 'auth',
        component: AuthLayoutComponent,
        children: [
            {
                path: 'login', component: LoginComponent
            }
        ]
    },
    {
        path: '',
        component: MainLayoutComponent,
        children: [
            { path: 'dashboard', component: DashboardComponent },
            { path: 'master/users', component: UsersComponent, resolve: { userData: userResolver, roleData: roleResolver, departmentData: departmentResolver } },
            { path: 'master/roles', component: RoleComponent, resolve: { roleData: roleResolver } },
            { path: 'master/departments', component: DepartmentComponent, resolve: { departmentData: departmentResolver } },
            { path: 'master/menus', component: MenuComponent, resolve: { menuData: menuResolver } }
        ]
    }
];
