import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { LocalStorageService } from '../localStorage.service';

import { ResponsePayload } from '../../models/payload.model';

@Injectable({
  providedIn: 'root'
})
export class HelpService {

  constructor(
    private localStorageService: LocalStorageService,
    private http: HttpClient,
  ) {}

  private async postRequestHelpPDF(url, petitionObject) {
    let userToken = JSON.parse(this.localStorageService.get('userToken')) as ResponsePayload;
    let headers = new HttpHeaders({
      "Content-Type": 'application/json',
      "user-token": userToken.accessToken,
    });
    return this.http.post<any>(url, petitionObject, {
      headers: headers
    }).toPromise();
  }

  private async postRequestHelpUserEntryPDF(url, petitionObject) {
    let headers = new HttpHeaders({
      "Content-Type": 'application/json',
    });
    return this.http.post<any>(url, petitionObject, {
      headers: headers
    }).toPromise();
  }

  /*
  * HELP QUERIES
  *
  */
  async getHelpPDF(data) {
    const response = await this.postRequestHelpPDF(`${environment.serverUrl}/api/user/getHelpPdf`, data);
    return response;
  }

  async getHelpUserEntryPDF(data) {
    const response = await this.postRequestHelpUserEntryPDF(`${environment.serverUrl}/api/entryUser/getHelpPdf`, data);
    return response;
  }

}