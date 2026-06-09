import { AfterViewInit, Component, inject, OnInit, PLATFORM_ID } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { NavbarComponent } from "../../component/navbar/navbar.component";
import { SidebarComponent } from "../../component/sidebar/sidebar.component";
import { isPlatformBrowser } from "@angular/common";
import { LayoutService } from "../../service/layout.service";
import { initFlowbite } from 'flowbite';

@Component({
    selector: 'app-main-layout',
    standalone: true,
    imports: [RouterOutlet, NavbarComponent, SidebarComponent],
    templateUrl: './main-layout.component.html',
    styleUrls: ['./main-layout.component.css']
})
export class MainLayoutComponent implements OnInit, AfterViewInit {
    isSidebarOpen = true;
    isDark=false;
    user: any = null;
    private platformId = inject(PLATFORM_ID);
    private layout = inject(LayoutService);
    ngOnInit() {
        this.layout.sidebar$.subscribe(v => {
            this.isSidebarOpen = v;
        });
    }
    ngAfterViewInit(): void {
        if (isPlatformBrowser(this.platformId)) {
            initFlowbite();
        }
    }
    toggleTheme() {
        this.isDark = !this.isDark;
        document.documentElement.classList.toggle('dark', this.isDark);
    }
}