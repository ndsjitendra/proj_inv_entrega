import { Injectable } from '@angular/core';
import { Compresor } from '../../models/compresor.model';

@Injectable({
  providedIn: 'root'
})
export class CompresorStateService {

  currentRecord: Compresor;
  compresorInProgress: boolean = false;
  newCompresor: boolean = false;

  constructor() {
  }

  public set(record: Compresor) {
    this.currentRecord = record;
  }

  public get() {
    return this.currentRecord;
  }

  public clear() {
    this.currentRecord = null;
  }

  public turnOnCompresorInProgress() {
    this.compresorInProgress = true;
  }

  public turnOffCompresorInProgress() {
    this.compresorInProgress = false;
  }

  public checkCompresorInProgress() {
    return this.compresorInProgress;
  }

}
