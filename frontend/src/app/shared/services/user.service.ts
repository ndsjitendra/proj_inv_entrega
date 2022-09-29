import { Injectable } from '@angular/core';
import { ResponsePayload } from '../models/payload.model';
import { UserModel } from '../models/user.model';
import { LocalStorageService } from './localStorage.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private _userToken: ResponsePayload;
  private _user: UserModel

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
    const user = JSON.parse(this.localStorage.get('user')) as UserModel;
    this._user = user;
  }

  async setUser(user: UserModel) {
    this._user = user;
  }

  async logout() {
    this._user = null;
    this._userToken = null;
    this.localStorage.clear();
  }

}
