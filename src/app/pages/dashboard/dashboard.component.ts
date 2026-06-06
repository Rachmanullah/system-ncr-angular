import { CommonModule } from "@angular/common";
import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { LucideAngularModule } from "lucide-angular";
import { Subject } from "rxjs";

@Component({
    selector: 'app-dasboard',
    standalone: true,
    imports: [CommonModule, LucideAngularModule],
    templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit, AfterViewInit {
    private destroy$ = new Subject<void>();
    loading = true;
    constructor(private cdr: ChangeDetectorRef) { }
    ngOnInit(): void {
        
    }
    ngAfterViewInit(): void {
        
    }
}