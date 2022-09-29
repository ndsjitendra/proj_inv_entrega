import { Component, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-datepicker',
  templateUrl: 'datepicker.component.html',
  styleUrls: ['./datepicker.component.scss']
})

export class DatepickerComponent {

  _date: any;
  @Input()
  get date() {
    return this._date;
  }
  set date(val) {
    this._date = val;
    this.dateText = val;
  }

  @Input() isDisabled: boolean = false;
  @Input() showClearIcon: boolean = false;
  @Input() allowManual: boolean = false;
  @Input() dateError: boolean = false;
  @Input() minDate: Date;
  @Input() maxDate: Date;

  @Output() dateChanged: EventEmitter<Date> = new EventEmitter();
  @Output() focusOut: EventEmitter<any> = new EventEmitter();
  @Output() changed: EventEmitter<any> = new EventEmitter();
  @Output() blur: EventEmitter<any> = new EventEmitter();

  dateText;

  constructor() {
  }

  onDateChange(event) {
    this.dateChanged.emit(event.value);
  }

  onFocusOut() {
    this.focusOut.emit();
  }

  onChange() {
    this.changed.emit();
  }

  onEnter() {
    if (this.allowManual) {
      this.dateChanged.emit(this.dateText);
    }
  }

  onBlur() {
    this.blur.emit();
  }

  clearStartDate() {
    this.date = null;
    this.dateChanged.emit(null);
  }
}
