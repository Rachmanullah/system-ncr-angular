import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthRequest } from '../../core/class/auth.class';
import { AuthService } from '../../service/auth.service';
import { ButtonComponent } from '../../component/button/button';
import { InputComponent } from '../../component/inputCustom/input.component';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ButtonComponent,
        InputComponent
    ],
    templateUrl: './login.component.html'
})
export class LoginComponent {

    readonly form = signal<AuthRequest>({
        username: '',
        password: ''
    });

    readonly isLoading = signal(false);

    readonly formErrors = computed(() => ({
        username: this.form().username.trim()
            ? ''
            : 'Username is required',

        password: this.form().password.trim()
            ? ''
            : 'Password is required'
    }));

    readonly isValid = computed(() =>
        !this.formErrors().username &&
        !this.formErrors().password
    );

    readonly showErrors = signal(false);

    constructor(
        private router: Router,
        private authService: AuthService
    ) { }

    updateUsername(value: string) {
        this.form.update(form => ({
            ...form,
            username: value
        }));
    }

    updatePassword(value: string) {
        this.form.update(form => ({
            ...form,
            password: value
        }));
    }

    onSubmit() {

        this.showErrors.set(true);

        if (!this.isValid()) {
            return;
        }

        this.isLoading.set(true);

        this.authService.AuthLogin(this.form()).subscribe({
            next: (response) => {
                this.isLoading.set(false);
                this.authService.saveAuth(response.data);
                this.router.navigate(['/dashboard']);
            },
            error: (error) => {
                this.isLoading.set(false);

                console.error(error);
            }
        });
    }
}