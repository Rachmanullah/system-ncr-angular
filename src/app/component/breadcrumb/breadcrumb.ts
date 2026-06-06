import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { LucideAngularModule } from "lucide-angular";

export interface BreadCrumbItem {
  title: string;
  icon?: string;        
  separatorIcon?: string;
}

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './breadcrumb.html'
})

export class BreadCrumbComponent{
     @Input() items: BreadCrumbItem[] = [];
}