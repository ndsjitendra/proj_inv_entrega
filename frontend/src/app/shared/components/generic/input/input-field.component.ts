import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator } from '@angular/forms';

@Component({
  selector: 'app-input-field',
  templateUrl: 'input-field.component.html',
  styleUrls: ['./input-field.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: InputFieldComponent,
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: InputFieldComponent,
      multi: true
    }
  ]
})

export class InputFieldComponent implements ControlValueAccessor, Validator {

  @Input() label: string;
  @Input() type: string;
  @Input() placeholder: string = undefined;
  @Input() min: number;
  @Input() max: number;
  @Input() minlength: number;
  @Input() maxlength: number;
  @Input() isRequired: boolean;
  @Input() isValidated: boolean = false;
  @Input() showLabel: boolean = true;
  @Input() disableCheck: boolean = false;
  @Input() autoScroll: boolean = false;
  @Input() upperCase: boolean = false;
  @Input() hint: string = '';
  @Output() onBlur = new EventEmitter();

  touched = false;
  disabled = false;
  onChange = (value) => { };
  onTouched = () => { };

  value: any;

  constructor() { }

  valueChange(event) {
    this.markAsTouched();
    if (!this.disabled) {
      this.value = event.detail.value;
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
        if (this.type === 'text') {
          if (controlValue === '' || controlValue === null) {
            return {
              required: {
                text: 'Campo requerido'
              }
            };
          }
          return this.validateTextInput(controlValue);
        }
        if (this.type === 'number') {
          if (controlValue === '' || controlValue === null) {
            return {
              required: {
                text: 'Campo requerido'
              }
            };
          }
          return this.validateNumberInput(controlValue);
        }
      } else {
        if (this.type === 'text') {
          return this.validateTextInput(controlValue);
        }
        if (this.type === 'number') {
          return this.validateNumberInput(controlValue);
        }
      }
    } else {
      return null;
    }
  }

  validateTextInput(input: string) {
    if (input) {
      if (input.length > this.maxlength) {
        return {
          invalid: {
            text: `The text cannot be more than ${this.maxlength} characters long`
          }
        };
      }
      if (input.length < this.minlength) {
        return {
          invalid: {
            text: `The text cannot be less than ${this.minlength} characters long`
          }
        };
      }
    } else {
      return null;
    }
  }

  validateNumberInput(input: number) {
    if (input) {
      if (input > this.max) {
        return {
          invalid: {
            text: `The field cannot be bigger than ${this.max}`
          }
        };
      }
      if (input < this.min) {
        return {
          invalid: {
            text: `The field cannot be lower than ${this.min}`
          }
        };
      }
    } else {
      return null;
    }
  }

  numberOnlyValidation(event: any, value = null, max = null) {
    if (this.type === 'number') {
      if (event.charCode === 101 || event.charCode === 45 || event.charCode === 43) {
        event.preventDefault();
      }
    }
    if (this.type === 'number') {
      const pattern = /[0-9]/;
      const inputChar = String.fromCharCode(event.charCode);
      if (!pattern.test(inputChar)) {
        event.preventDefault();
      }
      if (value && max && +(value.toString() + inputChar) > +max) {
        event.preventDefault();
      }
    }
  }

  focus(event) {
    if (this.autoScroll) {
      event.srcElement.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
    }
  }

  blur() {
    this.onBlur.emit();
  }
}
