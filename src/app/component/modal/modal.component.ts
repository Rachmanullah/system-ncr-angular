import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
})
export class ModalComponent {

  @Input() title = '';

  @Input() width = '600px';

  @Input() showCloseButton = true;

  @Input() closeOnBackdrop = true;

  @Input() rounded = 'rounded-2xl';

  @Output() close = new EventEmitter<void>();

  onBackdropClick() {
    if (this.closeOnBackdrop) {
      this.close.emit();
    }
  }
}