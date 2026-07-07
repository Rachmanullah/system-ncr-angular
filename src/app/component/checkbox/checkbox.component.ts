import { CommonModule } from "@angular/common";
import { Component, forwardRef, Input } from "@angular/core";
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from "@angular/forms";
import { checkboxOption } from "../../core/class/checkbox.class";

@Component({
    selector: 'app-checkbox',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './checkbox.component.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => CheckboxComponent),
            multi: true,
        },
    ],
})
export class CheckboxComponent implements ControlValueAccessor {
    @Input() label = '';
    @Input() options: checkboxOption[] = [];
    @Input() disabled = false;
    @Input() error = '';
    value: (string | number)[] = [];
    private onChangeFn: (value: any) => void = () => {};
    private onTouchedFn: () => void = () => {};

    writeValue(value: any): void {
        this.value = Array.isArray(value) ? value : [];
    }

    registerOnChange(fn: any): void {
        this.onChangeFn = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouchedFn = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    isChecked(value: string | number): boolean {
        return this.value.includes(value);
    }

    onCheckboxChange(
        checked: boolean,
        optionValue: string | number
    ) {

        if (checked) {
            if (!this.value.includes(optionValue)) {
                this.value = [...this.value, optionValue];
            }
        } else {
            this.value = this.value.filter(v => v !== optionValue);
        }

        this.onChangeFn(this.value);
        this.onTouchedFn();
    }
}