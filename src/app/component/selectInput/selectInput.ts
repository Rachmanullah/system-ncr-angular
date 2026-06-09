import { CommonModule } from "@angular/common";
import { Component, forwardRef, Input } from "@angular/core";
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from "@angular/forms";
import { LucideAngularModule } from "lucide-angular";

export interface SelectOption {
    label: string;
    value: string | number;
}

@Component({
    selector: 'app-select-input',
    standalone: true,
    imports: [CommonModule,FormsModule, LucideAngularModule],
    templateUrl: './selectInput.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SelectInputComponent),
            multi: true,
        },
    ],
})
export class SelectInputComponent implements ControlValueAccessor {

    @Input() label = '';
    @Input() placeholder = 'Select option';
    @Input() options: SelectOption[] = [];
    @Input() disabled = false;
    @Input() error = '';
    value: any = '';

    private onChangeFn: (value: any) => void = () => { };
    private onTouchedFn: () => void = () => { };

    writeValue(value: any): void {
        this.value = value;
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

    onSelectChange(value: string | number) {
        const parsedValue =
            value !== '' && !isNaN(Number(value))
                ? Number(value)
                : value;

        this.value = parsedValue;

        this.onChangeFn(parsedValue);
        this.onTouchedFn();
    }
}
