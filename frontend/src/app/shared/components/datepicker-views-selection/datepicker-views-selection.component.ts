import {Component, EventEmitter, Inject, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MatDatepicker} from '@angular/material/datepicker';

// Depending on whether rollup is used, moment needs to be imported differently.
// Since Moment.js doesn't have a default export, we normally need to import using the `* as`
// syntax. However, rollup creates a synthetic default module and we thus need to import it using
// the `default as` syntax.
import moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import { Moment } from 'moment';

// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/

export class MyFormat {
  value = 1;
  constructor() { }
  get display() {
    return this.value==1?
     {
        dateInput: 'MM/YYYY',
        monthYearLabel: 'MMM YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM YYYY',
      }:{
        dateInput: 'YYYY',
        monthYearLabel: 'YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'YYYY',
    }
  }
  get parse(){
    return this.value==1?{
        dateInput: 'LL/YYYY',
      }:{
      dateInput: 'YYYY'
      }
  }
}

/** @title Datepicker emulating a Year and month picker */
@Component({
  selector: 'datepicker-views-selection',
  templateUrl: 'datepicker-views-selection.component.html',
  styleUrls: ['datepicker-views-selection.component.scss'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE,  MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    { provide: MAT_DATE_FORMATS, useClass: MyFormat },
    { provide: MAT_DATE_LOCALE, useValue: 'es-Es' }
  ],
})
export class DatepickerViewsSelection implements OnChanges{
  @Input() placeholder: string = 'Elegir una fecha';
  @Input() displayDateFormat: string = 'month';
  @Input() startView = 'year' as "year" | "multi-year" | "month";
  @Output() onMonthChange: EventEmitter<any> = new EventEmitter();
  @Output() onYearChange: EventEmitter<any> = new EventEmitter();
  date = new FormControl(moment());
  today = new Date();
  
  constructor(@Inject(MAT_DATE_FORMATS) public config: MyFormat) { }

  ngOnChanges() {
    console.log("CHANGES: ", this.displayDateFormat)
    this.date.reset();
    // this.date.setValue(moment());
    if (this.displayDateFormat === 'month') {
      this.startView = 'year';
      this.config.value = 1;
    } 
    if (this.displayDateFormat === 'year') {
      this.startView = 'multi-year';
      this.config.value = 0;
    }
    
  }

  chosenYearHandler(normalizedYear: Moment, datepicker) {
    if (!this.date.value) {
      this.date.setValue(moment());
    }
    const ctrlValue = this.date.value;
    ctrlValue.year(normalizedYear.year());
    this.date.setValue(ctrlValue);
    this.onYearChange.emit(ctrlValue);
    datepicker.close();
  }

  chosenMonthHandler(
    normalizedMonth: Moment,
    datepicker: MatDatepicker<Moment>
  ) {
    if (!this.date.value) {
      this.date.setValue(moment());
    }
    const ctrlValue = this.date.value;
    ctrlValue.month(normalizedMonth.month());
    this.date.setValue(ctrlValue);
    this.onMonthChange.emit(ctrlValue);
    datepicker.close();
  }
}
