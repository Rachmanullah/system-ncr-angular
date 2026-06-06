import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";
import { LucideAngularModule } from "lucide-angular";
import { LayoutService } from "../../service/layout.service";
import { MenuItem } from "../../core/class/menu.class";
import { Observable, of } from "rxjs";
import { DUMMY_MENUS } from "../../constant/menu.constant";

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [CommonModule, RouterModule, LucideAngularModule],
    templateUrl: './sidebar.component.html'
})
export class SidebarComponent{
    isOpen = true;
    menus$!: Observable<MenuItem[]>;
    constructor(private layout: LayoutService) {
        this.layout.sidebar$.subscribe(v => this.isOpen = v);
    }
     ngOnInit(): void {
         this.menus$ = of(DUMMY_MENUS);
     }
}