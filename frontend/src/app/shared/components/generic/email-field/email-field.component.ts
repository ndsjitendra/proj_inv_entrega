import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator } from '@angular/forms';
import { EmailValidator } from '../../../common/EmailValidator';

@Component({
  selector: 'app-email-field',
  templateUrl: 'email-field.component.html',
  styleUrls: ['./email-field.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: EmailFieldComponent,
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: EmailFieldComponent,
      multi: true
    }
  ]
})

export class EmailFieldComponent implements ControlValueAccessor, Validator {

  @Input() label: string;
  @Input() placeholder: string = undefined;
  @Input() minlength: number;
  @Input() maxlength: number;
  @Input() isRequired: boolean;
  @Input() isValidated: boolean = false;
  @Input() showLabel: boolean = true;
  @Input() disableCheck: boolean = false;
  @Input() autoScroll: boolean = false;

  @Output() onBlur = new EventEmitter();

  touched = false;
  disabled = false;
  onChange = (value) => { };
  onTouched = () => { };

  value: any;
  emailValidator: EmailValidator = new EmailValidator();

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

  validate(control: AbstractControl): any {
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
        return this.validateEmailInput(controlValue);
      } else {
        return this.validateEmailInput(controlValue);
      }
    } else {
      return null;
    }
  }

  validateEmailInput(input: string) {
    if (input) {
      if (!this.emailValidator.processValidator(input)) {
        return {
          required: {
            text: 'Invalid Email'
          }
        };
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

  blur() {
    this.onBlur.emit();
  }
}
