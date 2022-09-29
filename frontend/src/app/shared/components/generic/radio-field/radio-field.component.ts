import { Component, Input } from '@angular/core';
import { AbstractControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator } from '@angular/forms';

@Component({
  selector: 'app-radio-field',
  templateUrl: 'radio-field.component.html',
  styleUrls: ['./radio-field.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: RadioFieldComponent,
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: RadioFieldComponent,
      multi: true
    }
  ]
})

export class RadioFieldComponent implements ControlValueAccessor, Validator {

  @Input() label: string;
  @Input() options: { value: string, label: string }[];
  @Input() isRequired: boolean;
  @Input() isValidated: boolean = false;
  @Input() showLabel: boolean = true;
  @Input() labelGreyed: boolean = true;
  @Input() disableCheck: boolean = false;
  @Input() locked: boolean = false;
  @Input() autoScroll: boolean = false;

  touched = false;
  disabled = false;
  onChange = (value) => { };
  onTouched = () => { };

  value: any;

  constructor() { }

  valueChange(event, ev2) {
    if (this.disableCheck) {
      return;
    }
    this.markAsTouched();
    if (this.autoScroll) {
      ev2.srcElement.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
    }
    if (!this.disabled) {
      if (this.value === event) {
        this.value = '';
        this.onChange('');
      } else {
        this.value = event;
        this.onChange(this.value);
      }
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
}
