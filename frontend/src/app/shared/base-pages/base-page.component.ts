import { Directive, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Compresor } from '../models/compresor.model';
import { ResponsePayload } from '../models/payload.model';
import { UserModel } from '../models/user.model';
// import { LocalDbService } from '../services/local-db.service';
import { LocalStorageService } from '../services/localStorage.service';
import { ServerService } from '../services/server-connection/server.services';
import { UserService } from '../services/user.service';

@Directive()
export class BasePageComponentDirective implements OnInit {

  get user(): UserModel {
    return this.userService.user;
  }

  get userToken(): ResponsePayload {
    return this.userService.userToken;
  }

  constructor(
    protected serverService: ServerService,
    protected userService: UserService,
    protected localStorageService: LocalStorageService,
    protected spinnerService: NgxSpinnerService
    // protected localDbService: LocalDbService
  ) {

  }

  async ngOnInit() {

  }


}
