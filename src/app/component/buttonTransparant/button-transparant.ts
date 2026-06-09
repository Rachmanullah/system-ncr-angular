import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-button-transparant',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './button-transparant.html',
})
export class ButtonTransparantComponent {
  @Input() title = '';
  @Input() disabled = false;
  @Input() icon?: string;

  @Input() fullWidth = false;
  @Input() width?: string;
  
  @Output() onClick = new EventEmitter<void>();

  get buttonClass(): string {
    return `
      inline-flex
      items-center
      justify-center
      gap-2
      rounded-lg
      px-4
      py-2
      text-sm
      font-medium
      transition-all
      duration-200
      border
      border-blue-400
      text-blue-600
      bg-transparent
      hover:bg-blue-50
      hover:text-blue-700
      focus:outline-none
      focus:ring-2
      focus:ring-blue-200
      disabled:opacity-60
      disabled:cursor-not-allowed
      ${this.fullWidth ? 'w-full' : ''}
    `;
  }
}
