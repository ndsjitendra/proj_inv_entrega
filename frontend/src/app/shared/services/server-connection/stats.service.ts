import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { LocalStorageService } from '../localStorage.service';

import { ResponsePayload } from '../../models/payload.model';

@Injectable({
  providedIn: 'root'
})
export class StatsService {

  constructor(
    private localStorageService: LocalStorageService,
    private http: HttpClient,
  ) {}

  private async postRequestFilteredStats(url, data) {
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
  * STATS QUERIES
  *
  */
    async getFilteredStats(data: any) {
      const response = await this.postRequestFilteredStats(`${environment.serverUrl}/api/stats/getFilteredStats`, data);
      return response;
    }

}