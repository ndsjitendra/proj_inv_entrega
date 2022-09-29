import { Injectable } from '@angular/core';
import { Record } from '../models/record.model';

@Injectable({
  providedIn: 'root'
})
export class RecordStateSevice {

  currentRecord: Record;
  recordInProgress: boolean = false;

  constructor() {
  }

  public set(record: Record) {
    this.currentRecord = record;
  }

  public get() {
    return this.currentRecord;
  }

  public clear() {
    this.currentRecord = null;
  }

  public turnOnRecordInProgress() {
    this.recordInProgress = true;
  }

  public turnOffRecordInProgress() {
    this.recordInProgress = false;
  }

  public checkRecordInProgress() {
    return this.recordInProgress;
  }

}
