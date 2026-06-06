import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './layouts/auth/auth-layout.component';
import { LoginComponent } from './pages/auth/login.component';
import { MainLayoutComponent } from './layouts/main/main-layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

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
        path:'',
        component: MainLayoutComponent,
        children: [
            { path: 'dashboard', component: DashboardComponent}
        ]
    }
];
