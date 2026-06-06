import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-user-modal',
  imports: [CommonModule, FormsModule],
  templateUrl: './user-modal.component.html'
})
export class UserModalComponent implements OnChanges {

  @Input() mode: 'add' | 'edit' = 'add';
  @Input() data: any;
  @Input() errors: any = {};
  @Input() submitting = false;
  @Input() roles: any[] = []

  @Output() save = new EventEmitter<any>();
  @Output() close = new EventEmitter<void>();

  form = {
    name: '',
    username: '',
    password: '',
    roleId: ''
  };

  ngOnChanges() {
    if (this.mode === 'edit' && this.data) {
      this.form = { ...this.data };
    }
  }

  submit() {
    this.save.emit(this.form);
    console.log(this.errors)
  }
}
