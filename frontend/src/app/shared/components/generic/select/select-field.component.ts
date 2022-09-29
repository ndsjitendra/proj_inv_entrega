import { Component, Input } from '@angular/core';
import { AbstractControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator } from '@angular/forms';
import { DropdownPosition } from '@ng-select/ng-select';

@Component({
  selector: 'app-select-field',
  templateUrl: 'select-field.component.html',
  styleUrls: ['./select-field.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: SelectFieldComponent,
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: SelectFieldComponent,
      multi: true
    }
  ]
})

export class SelectFieldComponent implements ControlValueAccessor, Validator {

  @Input() label: string;
  @Input() optionList: string[];
  @Input() isRequired: boolean;
  @Input() isValidated: boolean = false;
  @Input() showLabel: boolean = true;
  @Input() disableCheck: boolean = false;
  @Input() locked = false;
  @Input() placeholder: string = null;
  @Input() autoScroll: boolean = false;
  @Input() dropdownPosition: DropdownPosition = 'auto';

  touched = false;
  disabled = false;
  onChange = (value) => { };
  onTouched = () => { };

  value: any;

  constructor() { }

  valueChange(event) {
    this.markAsTouched();
    if (!this.disabled) {
      this.value = event;
      this.onChange(this.value);
    }
  }

  writeValue(value: any) {
    this.value = value;
  }

  registerOnChange(onChange: any) {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: any) {
    this.onTouched = onTouched;
  }

  markAsTouched() {
    if (!this.touched) {
      this.onTouched();
      this.touched = true;
    }
  }

  setDisabledState(disabled: boolean) {
    this.disabled = disabled;
  }

  validate(control: AbstractControl): ValidationErrors | null {
    if (control) {
      const controlValue = control.value;
      if (this.isRequired) {
        if (controlValue === '' || controlValue === null) {
          return {
            required: {
              text: 'Campo requerido'
            }
          };
        }
      }
    } else {
      return null;
    }
  }

  onFocus(event) {
    if (this.autoScroll) {
      event.srcElement.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
    }
  }
}
