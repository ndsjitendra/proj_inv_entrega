import { Component, Input } from '@angular/core';
import { AbstractControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator } from '@angular/forms';

@Component({
  selector: 'app-checkbox-field',
  templateUrl: 'checkbox-field.component.html',
  styleUrls: ['./checkbox-field.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: CheckboxFieldComponent,
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: CheckboxFieldComponent,
      multi: true
    }
  ]
})

export class CheckboxFieldComponent implements ControlValueAccessor, Validator {

  @Input() label: string;
  @Input() isRequired: boolean;
  @Input() isValidated: boolean = false;
  @Input() nullable: boolean = true;
  @Input() checkboxSizeLarge: boolean = false;

  touched = false;
  disabled = false;
  onChange = (value) => { };
  onTouched = () => { };

  value: boolean = false;

  constructor() {
  }

  valueChange(onChangeEvent, onClickEvent?) {
    this.markAsTouched();
    if (!this.disabled) {
      if (onChangeEvent) {
        if (onChangeEvent.detail.checked === true) {
          this.value = onChangeEvent.detail.checked;
          this.onChange(this.value);
        }
        if (onChangeEvent.detail.checked === false) {
          this.value = onChangeEvent.detail.checked;
          this.onChange(this.nullable ? null : false);
        }
      } else {
        const newValue = !this.value;
        this.value = newValue;
        if (newValue === false) {
          this.onChange(this.nullable ? null : false);
        } else {
          this.onChange(newValue);
        }
      }
    }
  }

  writeValue(value: boolean) {
    this.value = !!value;
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
}
