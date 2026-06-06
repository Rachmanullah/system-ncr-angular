import { CommonModule } from "@angular/common";
import { Component, forwardRef, Input } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

@Component({
    selector: 'app-input',
    standalone: true,
    templateUrl: './input.component.html',
    imports: [CommonModule],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => InputComponent),
            multi: true
        }
    ]
})

export class InputComponent implements ControlValueAccessor {

    @Input() label = '';
    @Input() type: string = 'text';
    @Input() placeholder = '';
    @Input() readonly = false;
    @Input() required = false;
    @Input() error: string | null = null;
    @Input() name = '';

    value: any = '';
    disabled = false;

    onChange = (_: any) => { };
    onTouched = () => { };

    writeValue(value: any): void {
        this.value = value ?? '';
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    handleInput(event: Event) {
        const value = (event.target as HTMLInputElement).value;
        this.value = value;
        this.onChange(value);
    }
}