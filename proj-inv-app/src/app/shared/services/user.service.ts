import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ResponsePayload } from '../models/payload.model';
import { UserModel } from '../models/user.model';
import { LocalStorageService } from './localStorage.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private _userToken: ResponsePayload;
  private _user: UserModel;

  private loggedIn = new Subject<boolean>();

  private tab: string = '';

  public get userToken(): ResponsePayload {
    return this._userToken;
  }

  public get user(): UserModel {
    return this._user;
  }

  constructor(
    private localStorage: LocalStorageService,
  ) {
    this.init();
  }

  async init() {
    const userToken = JSON.parse(this.localStorage.get('userToken'));
    this._userToken = userToken;
    this.loggedIn.next(true);
    const user = JSON.parse(this.localStorage.get('user')) as UserModel;
    this._user = user;
  }

  async setUser(user: UserModel) {
    this._user = user;
  }

  async logout() {
    this._user = null;
    this._userToken = null;
    this.loggedIn.next(false);
    this.localStorage.clear();
  }

  setTab(tab: string) {
    this.tab = tab;
  }

  getTab() {
    return this.tab;
  }

  get userLoggedIn() {
    return this.loggedIn.asObservable();
  }

}
