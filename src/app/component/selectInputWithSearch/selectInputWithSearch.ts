import { CommonModule } from "@angular/common";
import { Component, forwardRef, Input } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { LucideAngularModule } from "lucide-angular";

export interface SelectOption {
    label: string;
    value: string | number;
}

@Component({
    selector: 'app-select-input-with-search',
    standalone: true,
    imports: [CommonModule, LucideAngularModule],
    templateUrl: './selectInputWithSearch.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SelectInputWithSearchComponent),
            multi: true,
        },
    ],
})
export class SelectInputWithSearchComponent implements ControlValueAccessor {

    @Input() label = '';
    @Input() placeholder = 'Select option';
    @Input() options: SelectOption[] = [];
    @Input() disabled = false;

    value: any = '';
    searchText = '';
    open = false;

    filteredOptions: SelectOption[] = [];

    private onChangeFn: (value: any) => void = () => { };
    private onTouchedFn: () => void = () => { };

    ngOnInit() {
        // this.filteredOptions = this.options;
        this.filteredOptions = this.computedOptions;
    }

    get selectedLabel(): string {
        // return this.options.find(o => o.value === this.value)?.label ?? '';
        const found = this.options.find(o => o.value === this.value);
        return found ? found.label : (this.value ?? '');
    }

    toggle() {
        if (this.disabled) return;
        this.open = !this.open;
        // this.filteredOptions = this.options;
        this.filteredOptions = this.computedOptions;
        this.searchText = '';
    }

    close() {
        setTimeout(() => (this.open = false), 150);
        this.onTouchedFn();
    }

    // onSearch(event: Event) {
    //     const keyword = (event.target as HTMLInputElement).value.toLowerCase();
    //     // this.filteredOptions = this.options.filter(o =>
    //     //     o.label.toLowerCase().includes(keyword)
    //     // );
    //     this.filteredOptions = this.computedOptions.filter(o =>
    //         o.label.toLowerCase().includes(keyword)
    //     );
    // }

    onSearch(event: Event) {
        this.searchText = (event.target as HTMLInputElement).value;

        const keyword = this.searchText.toLowerCase();

        this.filteredOptions = this.computedOptions.filter(o =>
            o.label.toLowerCase().includes(keyword)
        );

        if (this.filteredOptions.length === 0 && this.searchText.trim()) {
            this.filteredOptions = [
                {
                    label: `Use "${this.searchText}"`,
                    value: this.searchText,
                },
            ];
        }
    }


    selectOption(option: SelectOption) {
        this.value = option.value;
        this.open = false;

        this.onChangeFn(this.value);
        this.onTouchedFn();
    }

    writeValue(value: any): void {
        this.value = value ?? '';
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

    get computedOptions(): SelectOption[] {
        if (
            this.value &&
            !this.options.some(o => o.value === this.value)
        ) {
            return [
                { label: this.value, value: this.value },
                ...this.options,
            ];
        }
        return this.options;
    }

}
