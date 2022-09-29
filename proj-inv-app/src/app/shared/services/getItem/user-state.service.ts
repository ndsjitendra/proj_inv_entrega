import { Injectable } from '@angular/core';
import { UserModel } from '../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserStateService {

  currentRecord: UserModel;
  userInProgress: boolean = false;

  constructor() {
  }

  public set(record: UserModel) {
    this.currentRecord = record;
  }

  public get() {
    return this.currentRecord;
  }

  public clear() {
    this.currentRecord = null;
  }

  public turnOnUserInProgress() {
    this.userInProgress = true;
  }

  public turnOffUserInProgress() {
    this.userInProgress = false;
  }

  public checkUserInProgress() {
    return this.userInProgress;
  }

}
