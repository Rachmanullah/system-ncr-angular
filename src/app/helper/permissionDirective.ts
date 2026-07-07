import { Directive, Input, TemplateRef, ViewContainerRef, inject, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';

@Directive({
    selector: '[appHasPermission]',
    standalone: true,
})
export class HasPermissionDirective implements OnInit {
    @Input('appHasPermission') action = '';

    private templateRef = inject(TemplateRef<any>);
    private viewContainer = inject(ViewContainerRef);
    private authService = inject(AuthService);

    ngOnInit(): void {
        if (this.authService.hasPermission(this.action)) {
            this.viewContainer.createEmbeddedView(this.templateRef);
        } else {
            this.viewContainer.clear();
        }
    }
}