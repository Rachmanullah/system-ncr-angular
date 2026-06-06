import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, OnChanges, Output } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ModalField } from "../../../core/class/modal.class";

@Component({
    selector: 'app-generic-modal',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './generic-modal.component.html'
})
export class GenericModalComponent implements OnChanges {
    @Input() title = '';
    @Input() mode: 'add' | 'edit' = 'add';
    @Input() fields: ModalField[] = [];
    @Input() data: any = {};
    @Input() errors: any = {};
    @Input() submitting = false;

    @Output() save = new EventEmitter<any>();
    @Output() close = new EventEmitter<void>();

    form: any = {};

    ngOnChanges() {
        this.form = this.mode === 'edit'
            ? { ...this.data }
            : {};
    }

    submit() {
        this.save.emit(this.form);
    }

    get visibleFieldsCount(): number {
        return this.fields.filter(
            f => !(this.mode === 'edit' && f.hiddenOnEdit)
        ).length;
    }

    get isTwoColumn(): boolean {
        return this.visibleFieldsCount > 5;
    }
}