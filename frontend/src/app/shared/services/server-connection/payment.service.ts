import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { LocalStorageService } from '../localStorage.service';

import { ResponsePayload } from '../../models/payload.model';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(
    private localStorageService: LocalStorageService,
    private http: HttpClient,
  ) {}

  private async postRequestPayments(url, data) {
    let userToken = JSON.parse(this.localStorageService.get('userToken')) as ResponsePayload;
    let headers = new HttpHeaders({
      "Content-Type": 'application/json',
      "user-token": userToken.accessToken,
    });
    return this.http.post<any>(url, data, {
      headers: headers
    }).toPromise();
  }

  /*
  * PAYMENT QUERIES
  *
  */
    async getPaymentInformation(data: any) {
      const response = await this.postRequestPayments(`${environment.serverUrl}/api/payment/getPaymentInformation`, data);
      return response;
    }

}