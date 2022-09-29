import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { UserService } from '../user.service';
import { ResponsePayload } from '../../models/payload.model';
import { LocalStorageService } from '../localStorage.service';
// import { LocalDbService } from './local-db.service';
import { Record } from '../../models/record.model';

@Injectable({
  providedIn: 'root'
})
export class ServerService {

  constructor(
    private http: HttpClient,
    private localStorage: LocalStorageService,
    private userService: UserService,
    // private localDbService: LocalDbService,
  ) {

  }
  /* USER REQUESTS */
  private async postRequestRegister(url, data) {
    let headers = new HttpHeaders();
    const dataJSON = JSON.stringify(data);
    headers = headers.set("Content-Type", 'application/json');
    return this.http.post<string>(url, dataJSON, {
      headers: headers
    }).toPromise();
  }

  private async postRequestLogin(url, data) {
    let headers = new HttpHeaders();
    const dataJSON = JSON.stringify(data);
    headers = headers.set("Content-Type", 'application/json');
    return this.http.post<string>(url, dataJSON, {
      headers: headers
    }).toPromise();
  }

  private async postRequestUser(url, data) {
    let userToken = JSON.parse(this.localStorage.get('userToken')) as ResponsePayload;
    let headers = new HttpHeaders({
      "Content-Type": 'application/json',
      "user-token": userToken.accessToken,
    });

    return this.http.post<any>(url, data, {
      headers: headers
    }).toPromise();
  }

  private async postRequestUserSyncStatus(url, data) {
    let userToken = JSON.parse(this.localStorage.get('userToken')) as ResponsePayload;
    let headers = new HttpHeaders({
      "Content-Type": 'application/json',
      "user-token": userToken.accessToken,
    });
    return this.http.post<any>(url, data, {
      headers: headers
    }).toPromise();
  }

  /* COMPRESOR REQUESTS */

  private async postRequestCompresor(url, modelo) {
    let userToken = JSON.parse(this.localStorage.get('userToken')) as ResponsePayload;
    let headers = new HttpHeaders({
      "Content-Type": 'application/json',
      "user-token": userToken.accessToken,
    });

    return this.http.post<any>(url, modelo, {
      headers: headers
    }).toPromise();
  }

  private async getRequestAllCompresor(url) {
    let userToken = JSON.parse(this.localStorage.get('userToken')) as ResponsePayload;
    let headers = new HttpHeaders({
      "Content-Type": 'application/json',
      "user-token": userToken.accessToken,
    });

    return this.http.get<any>(url, {
      headers: headers
    }).toPromise();
  }

  /* DISTRIBUTOR QUERY */
  private async getRequestAllDistributors(url) {
    let userToken = JSON.parse(this.localStorage.get('userToken')) as ResponsePayload;
    let headers = new HttpHeaders({
      "Content-Type": 'application/json',
      "user-token": userToken.accessToken,
    });
    return this.http.get<any>(url, {
      headers: headers
    }).toPromise();
  }

  // REGISTERING WARRANTY
  private async postRegisterCompresor(url, modelo) {
    let userToken = JSON.parse(this.localStorage.get('userToken')) as ResponsePayload;
    let headers = new HttpHeaders({
      "Content-Type": 'application/json',
      "user-token": userToken.accessToken,
    });

    return this.http.post<any>(url, modelo, {
      headers: headers
    }).toPromise();
  }

  /* RECORD REQUESTS */

  private async postCheckSerial(url, qrValues) {
    let userToken = JSON.parse(this.localStorage.get('userToken')) as ResponsePayload;
    let headers = new HttpHeaders({
      "Content-Type": 'application/json',
      "user-token": userToken.accessToken,
    });

    return this.http.post<any>(url, qrValues, {
      headers: headers
    }).toPromise();
  }

  private async postRequestUserRecords(url, username) {
    let userToken = JSON.parse(this.localStorage.get('userToken')) as ResponsePayload;
    let headers = new HttpHeaders({
      "Content-Type": 'application/json',
      "user-token": userToken.accessToken,
    });
    return this.http.post<any>(url, username, {
      headers: headers
    }).toPromise();
  }

  private async postRequestAllUserRecords(url, username) {
    let userToken = JSON.parse(this.localStorage.get('userToken')) as ResponsePayload;
    let headers = new HttpHeaders({
      "Content-Type": 'application/json',
      "user-token": userToken.accessToken,
    });
    return this.http.post<any>(url, username, {
      headers: headers
    }).toPromise();
  }

  private async postRequestRecordPDF(url, petitionObject) {
    let userToken = JSON.parse(this.localStorage.get('userToken')) as ResponsePayload;
    let headers = new HttpHeaders({
      "Content-Type": 'application/json',
      "user-token": userToken.accessToken,
    });
    return this.http.post<any>(url, petitionObject, {
      headers: headers
    }).toPromise();
  }

  /*
    USER QUERIES
    *
    */

  async login(user) {
    return this.postRequestLogin(`${environment.serverUrl}/api/entryUser/login`, user);
  }

  async createUser(user) {
    return await this.postRequestRegister(`${environment.serverUrl}/api/entryUser/register`, user);
  }

  async getUser() {
    let userToken = JSON.parse(this.localStorage.get('userToken')) as ResponsePayload;
    const userIdObject = {
      id: userToken.userId
    };

    const response = await this.postRequestUser(`${environment.serverUrl}/api/user/getUser`, userIdObject);
    if (response) {
      this.userService.setUser(response.user[0]);
      this.localStorage.set('user', JSON.stringify(response.user[0]));

    }
  }

  async checkUserSyncStatus(userId) {
    const userIdVal = { id: userId }
    const response = await this.postRequestUserSyncStatus(`${environment.serverUrl}/api/user/getSyncStatus`, userIdVal);
    return response.resp;
  }

  async turnOffUserSyncStatus(userId) {
    const userIdVal = { id: userId }
    const response = await this.postRequestUserSyncStatus(`${environment.serverUrl}/api/user/updateSyncStatus`, userIdVal);
    return response.resp;
  }

  /*
    COMPRESOR QUERIES
    *
    */

  async getCompresor(modelo: string) {
    const response = await this.postRequestCompresor(`${environment.serverUrl}/api/compresor/getCompresor`, modelo);
    return response;
  }

  async getAllCompresors() {
    const response = await this.getRequestAllCompresor(`${environment.serverUrl}/api/compresor/getCompresores`);
    return response.compresores;
  }

  async getAllDistributors() {
    const response = await this.getRequestAllDistributors(`${environment.serverUrl}/api/distributor/getAllDistributors`);
    return response.distributors;
  }

  /*
    RECORD QUERIES
  *
  */

  async registrarGarantia(registro: Record) {
    const response = await this.postRegisterCompresor(`${environment.serverUrl}/api/record/registerRecord`, registro);
    return response;
  }

  async checkSerial(values: any) {
    const response = await this.postCheckSerial(`${environment.serverUrl}/api/record/checkSerial`, values);
    console.log("RESPONSE: ", response);
    return response;
  }

  async getRecordsForUser(username: string, offset) {
    const usernameObject = {
      username: username,
      offset: offset
    }
    const response = await this.postRequestUserRecords(`${environment.serverUrl}/api/record/getRecordsForUser`, usernameObject);
    console.log("RESPONSE: ", response)
    return response;
  }
  

  async getAllRecordsForUser(username: string) {
    const usernameObject = {
      username: username,
    };
    const response = await this.postRequestAllUserRecords(`${environment.serverUrl}/api/record/getAllRecordsForUser`, usernameObject);
    return response;
  }

  async getRecordPDF(username: string, recordLocalId) {
    const petitionObject = {
      username: username,
      recordLocalId: recordLocalId
    };
    const response = await this.postRequestRecordPDF(`${environment.serverUrl}/api/record/getRecordPdf`, petitionObject);
    return response;
  }

}
