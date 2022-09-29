import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator } from '@angular/forms';
import { CameraService } from 'src/app/shared/services/camera.service';

@Component({
  selector: 'app-camera-field',
  templateUrl: 'camera-field.component.html',
  styleUrls: ['./camera-field.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: CameraFieldComponent,
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: CameraFieldComponent,
      multi: true
    }
  ]
})

export class CameraFieldComponent implements ControlValueAccessor, Validator {
  @Output() deletePhotoEvent: EventEmitter<any> = new EventEmitter();
  @Input() label: string;
  @Input() isRequired: boolean;
  @Input() isValidated: boolean = false;
  @Input() showLabel: boolean = true;
  @Input() disableCheck: boolean = false;
  @Input() locked = false;
  @Input() autoScroll: boolean = false;
  @Input() setValueLabel: string = '';
  @Input() smallPhoto: boolean = false;

  touched = false;
  disabled = false;
  onChange = (value) => { };
  onTouched = () => { };

  value: any;

  constructor(private cameraService: CameraService) { }

  valueChange(event) {
    this.markAsTouched();
    if (!this.disabled) {
      this.value = event;
      this.onChange(this.value);
    }
  }

  async addImage() {
    const image = await this.cameraService.pickImage();
    this.valueChange(image);
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

  deletePhoto() {
    this.deletePhotoEvent.emit();
  }
}
