import { ChangeDetectorRef, Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { AuthRequest } from "../../core/class/auth.class";
import { Router } from "@angular/router";
import { ButtonComponent } from "../../component/button/button";
import { InputComponent } from "../../component/inputCustom/input.component";

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, FormsModule, ButtonComponent, InputComponent],
    templateUrl :'./login.component.html'
})
export class LoginComponent{
    form: AuthRequest = {
        username: "",
        password: ""
    };
    isLoading = false;
    formErrors: any = {};
    constructor(
        private router: Router,
        private cdr: ChangeDetectorRef
    ) {}

    onSubmit(){
        this.formErrors = {};
        this.isLoading = true;
        if(!this.form.username || !this.form.password){
            this.formErrors={
                username: !this.form.username ? 'Username is required' : null,
                password: !this.form.password ? 'Password is required' : null,
            }
            this.isLoading= false;
            return;  
        }
    }
}