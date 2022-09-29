import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserModel } from 'src/app/shared/models/user.model';
import { ServerService } from 'src/app/shared/services/server-connection/server.services';
import jwt_decode from 'jwt-decode';
import { LocalStorageService } from 'src/app/shared/services/localStorage.service';
import { ResponsePayload } from 'src/app/shared/models/payload.model';
import * as date_fns from 'date-fns';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  dataInitialized: boolean = false;
  user: string = "";
  password: string = "";
  token: string = "";
  credentialsError: boolean = false;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private queryService: ServerService,
    private localStorage: LocalStorageService,
    private spinnerService: NgxSpinnerService,
  ) { }

  ionViewWillEnter() {
    if (this.loginForm) {
      this.credentialsError = false;
      this.loginForm.reset();
    }
  }

  ngOnInit() {
    this.dataInitialized = false;
    this.spinnerService.show();
    this.createForm();
    this.dataInitialized = true;
    this.spinnerService.hide();
  }

  createForm() {
    this.loginForm = this.formBuilder.group({
      username: ["", Validators.email],
      password: ["", Validators.required]
    })
  }

  toRegister() {
    this.router.navigateByUrl('register');
  }

  changeUser() {
    this.user = this.loginForm.value.user;
  }
  changePassword() {
    this.password = this.loginForm.value.password;
  }

  async onSubmit() {
    this.credentialsError = false;
    if (this.loginForm.valid) {
      this.spinnerService.show();
      const resp = await this.queryService.login(this.loginForm.value);
      if (resp && resp['success']) {
        const payload = await jwt_decode(resp['success']) as ResponsePayload;
        const payloadLocal: ResponsePayload = {
          accessToken: resp['success'],
          createdAt: new Date(payload.createdAt),
          expiredAt: new Date(payload.expiredAt),
          userId: payload.userId
        }
        this.localStorage.set('userToken', JSON.stringify(payloadLocal));
        this.router.navigateByUrl('hub');
        this.spinnerService.hide();
      } else {
        this.credentialsError = true;
        this.spinnerService.hide();
      }
    }
  }



}

