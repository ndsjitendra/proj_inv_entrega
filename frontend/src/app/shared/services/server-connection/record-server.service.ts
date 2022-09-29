import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { LocalStorageService } from '../localStorage.service';

import { ResponsePayload } from '../../models/payload.model';

@Injectable({
  providedIn: 'root'
})
export class RecordServerSevice {

  constructor(
    private localStorageService: LocalStorageService,
    private http: HttpClient,
  ) { }

  private async postRequestRecordTileInformation(url, data) {
    let userToken = JSON.parse(this.localStorageService.get('userToken')) as ResponsePayload;
    let headers = new HttpHeaders({
      "Content-Type": 'application/json',
      "user-token": userToken.accessToken,
    });
    return this.http.post<any>(url, data, {
      headers: headers
    }).toPromise();
  }

  private async postRequestRecord(url, petitionObject) {
    let userToken = JSON.parse(this.localStorageService.get('userToken')) as ResponsePayload;
    let headers = new HttpHeaders({
      "Content-Type": 'application/json',
      "user-token": userToken.accessToken,
    });
    return this.http.post<any>(url, petitionObject, {
      headers: headers
    }).toPromise();
  }

  private async postUpdateStatus(url, petitionObject) {
    let userToken = JSON.parse(this.localStorageService.get('userToken')) as ResponsePayload;
    let headers = new HttpHeaders({
      "Content-Type": 'application/json',
      "user-token": userToken.accessToken,
    });
    return this.http.post<any>(url, petitionObject, {
      headers: headers
    }).toPromise();
  }

  /*
  * RECORD QUERIES
  *
  */
  async getRecordTileInformation(data: any) {
    const response = await this.postRequestRecordTileInformation(`${environment.serverUrl}/api/record/getRecordTileInformation`, data);
    return response
  }

  async getRecordInformation(data: any) {
    const response = await this.postRequestRecord(`${environment.serverUrl}/api/record/getRecord`, data);
    return response
  }

  async updateRecordStatus(data: any) {
    const response = await this.postUpdateStatus(`${environment.serverUrl}/api/record/updateRecordStatus`, data);
    return response
  }

}
