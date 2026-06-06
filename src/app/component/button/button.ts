import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { BUTTON_VARIANS, BUTTON_SIZES } from '../../constant/button.constant';
@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './button.html',
})
export class ButtonComponent {
  @Input() title: string = '';
  @Input() disabled?: boolean = false;
  @Input() icon?: string;
  @Input() variant: string = BUTTON_VARIANS.PRIMARY;
  @Input() size: string = BUTTON_SIZES.MD;
  @Input() fullWidth = false;
  @Input() width?: string;

  @Output() onClick: EventEmitter<void> = new EventEmitter();
  get buttonClass(): string {
    return `
        inline-flex
        items-center
        justify-center
        gap-2
        rounded-lg
        font-medium
        transition-all
        duration-200
        focus:outline-none
        focus:ring-2
        disabled:opacity-60
        disabled:cursor-not-allowed
        ${this.variant}
        ${this.size}
        ${this.fullWidth ? 'w-full' : ''}
    `;
  }
}
