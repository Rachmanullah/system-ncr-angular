import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-role-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './role-modal.component.html'
})
export class RoleModalComponent {
  @Input() mode: 'add' | 'edit' = 'add';
  @Input() data: any;
  @Input() errors: any = {};
  @Input() submitting = false;

  @Output() save = new EventEmitter<any>();
  @Output() close = new EventEmitter<void>();

  form = {
    roleId: '',
    roleName: ''
  };

  ngOnChanges() {
    if (this.mode === 'edit' && this.data) {
      this.form = { ...this.data };
    }
  }

  submit() {
    this.save.emit(this.form);
  }
}
