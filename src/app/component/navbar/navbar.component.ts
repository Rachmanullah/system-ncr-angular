import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { AuthBase } from '../../core/class/auth.class';
import { Router } from '@angular/router';
import { LayoutService } from '../../service/layout.service';

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [CommonModule, LucideAngularModule],
    templateUrl: './navbar.component.html'
})
export class NavbarComponent implements OnInit {
    profileOpen = false;
    user: AuthBase = {
        name: '',
        username: '',
    };
    server = '';

    constructor(
        private layout: LayoutService,
        private router: Router
    ) { }

    ngOnInit(): void {
        // this.authService.user$.subscribe(user => {
        //     this.user = user;
        //     const serverActive = this.authService.getActiveServer();
        //     this.server = serverActive === 'HOC2' ||serverActive ==='HOC' ? 'HOC' : serverActive;
        // });
    }


    toggleSidebar() {
        this.layout.toggle();
    }

    toggleProfile() {
        this.profileOpen = !this.profileOpen;
    }

    logout() {
        // this.authService.logout();
        this.router.navigate(['/login']);
    }

}
