import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BUTTON_VARIANTS, BUTTON_SIZES, BUTTON_RADIUS } from '../../constant/button.constant';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

type ButtonVariant =
  typeof BUTTON_VARIANTS[keyof typeof BUTTON_VARIANTS];

type ButtonSize =
  typeof BUTTON_SIZES[keyof typeof BUTTON_SIZES];

  type ButtonRadius =
  typeof BUTTON_RADIUS[keyof typeof BUTTON_RADIUS];
  
@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './button.html',
})
export class ButtonComponent {

  @Input() title = '';

  @Input() disabled = false;

  @Input() icon?: string;

  @Input()
  variant: ButtonVariant = BUTTON_VARIANTS.PRIMARY;

  @Input()
  size: ButtonSize = BUTTON_SIZES.MD;

  @Input()
  radius: ButtonRadius = BUTTON_RADIUS.LG;

  @Input()
  fullWidth = false;

  @Input()
  width?: string;

  @Input() customClass = '';

  @Output()
  onClick = new EventEmitter<void>();

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
      shadow-sm
      focus:outline-none
      focus:ring-2
      disabled:opacity-60
      disabled:cursor-not-allowed
      ${this.radius}
      ${this.variant}
      ${this.size}
      ${this.customClass}
      ${this.fullWidth ? 'w-full' : ''}
    `;
  }
}