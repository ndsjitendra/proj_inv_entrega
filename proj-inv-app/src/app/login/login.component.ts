import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ServerService } from '../shared/services/server.service';
import jwt_decode from 'jwt-decode';
import { ResponsePayload } from '../shared/models/payload.model';
import { NgxSpinnerService } from 'ngx-spinner';
import { LocalStorageService } from '../shared/services/localStorage.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  error: boolean = false;
  errorMessage: string = "";
  credentialsError: boolean = false;

  loginForm: FormGroup;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private serverService: ServerService,
    private spinnerService: NgxSpinnerService,
    private localStorage: LocalStorageService
  ) { }

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  async onSubmit() {
    this.credentialsError = false;
    if (this.loginForm.valid) {
      this.spinnerService.show();
      const resp = await this.serverService.login(this.loginForm.value);
      if (resp && resp['success']) {
        const payload = await jwt_decode(resp['success']) as ResponsePayload;
        const payloadLocal: ResponsePayload = {
          accessToken: resp['success'],
          createdAt: new Date(payload.createdAt),
          expiredAt: new Date(payload.expiredAt),
          userId: payload.userId
        }
        this.localStorage.set('userToken', JSON.stringify(payloadLocal));
        this.router.navigateByUrl('home');
        this.spinnerService.hide();
      } else {
        this.credentialsError = true;
        this.spinnerService.hide();
      }
    }
  }

  goHome() {
    this.router.navigateByUrl('home');
  }

}
