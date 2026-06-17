import { CommonModule } from '@angular/common';
import {
    Component,
    forwardRef,
    Input
} from '@angular/core';
import {
    ControlValueAccessor,
    NG_VALUE_ACCESSOR
} from '@angular/forms';

@Component({
    selector: 'app-textarea',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './textarea.component.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => TextareaComponent),
            multi: true,
        },
    ],
})
export class TextareaComponent implements ControlValueAccessor {

    @Input() label = '';
    @Input() placeholder = '';
    @Input() rows = 4;
    @Input() error = '';
    @Input() required = false;
    @Input() disabled = false;
    @Input() readonly = false;

    value = '';

    onChange = (value: string) => { };
    onTouched = () => { };

    writeValue(value: string): void {
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

    handleInput(event: Event): void {
        const value = (event.target as HTMLTextAreaElement).value;
        this.value = value;
        this.onChange(value);
    }
}