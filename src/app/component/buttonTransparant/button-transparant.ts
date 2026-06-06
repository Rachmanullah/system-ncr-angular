import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { LucideAngularModule } from "lucide-angular";

@Component({
  selector: 'app-button-transparant',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './button-transparant.html'
})
export class ButtonTransparantComponent{
    @Input() title: string= '';
    @Input() disabled?: boolean= false;
    @Input() icon?: string;

    @Output() onClick: EventEmitter<void> = new EventEmitter();
}