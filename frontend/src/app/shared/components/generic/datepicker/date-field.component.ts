import { Component, Input } from '@angular/core';
import { AbstractControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator } from '@angular/forms';

@Component({
  selector: 'app-date-field',
  templateUrl: 'date-field.component.html',
  styleUrls: ['./date-field.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: DateFieldComponent,
      multi: true
    },
     {
      provide: NG_VALIDATORS,
      useExisting: DateFieldComponent,
      multi: true
    }
  ]
})

export class DateFieldComponent implements ControlValueAccessor, Validator {

  @Input() label: string;
  @Input() isRequired: boolean;
  @Input() isValidated: boolean = false;
  @Input() showLabel: boolean = true;
  @Input() isDisabled: boolean = false;
  @Input() showClearIcon: boolean = false;
  @Input() allowManual: boolean = false;
  @Input() dateError: boolean = false;
  @Input() minDate: Date;
  @Input() maxDate: Date;
  @Input() autoScroll: boolean = false;


  touched = false;
  disabled = false;
  onChange = (value) => {};
  onTouched = () => {};

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

  focus(event) {
    if (this.autoScroll) {
      event.srcElement.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
    }
  }
}
