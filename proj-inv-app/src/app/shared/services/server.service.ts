import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ResponsePayload } from '../models/payload.model';
// import { LocalDbService } from './local-db.service';
import { Record } from '../models/record.model';
import { LocalStorageService } from './localStorage.service';
import { UserService } from './user.service';
import { Compresor } from '../models/compresor.model';
import { UserModel } from '../models/user.model';

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

  private async postRequestRegisterUserGeneral(url, data) {
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

  private async getRequestAllUsers(url) {
    let userToken = JSON.parse(this.localStorage.get('userToken')) as ResponsePayload;
    this.userService.init();
    let headers = new HttpHeaders({
      "Content-Type": 'application/json',
      "user-token": userToken.accessToken,
    });

    return this.http.get<any>(url, {
      headers: headers
    }).toPromise();
  }

  private async postNewUser(url, user) {
    let userToken = JSON.parse(this.localStorage.get('userToken')) as ResponsePayload;
    let headers = new HttpHeaders({
      "Content-Type": 'application/json',
      "user-token": userToken.accessToken,
    });

    return this.http.post<any>(url, user, {
      headers: headers
    }).toPromise();
  }

  private async postUpdateUser(url, user) {
    let userToken = JSON.parse(this.localStorage.get('userToken')) as ResponsePayload;
    let headers = new HttpHeaders({
      "Content-Type": 'application/json',
      "user-token": userToken.accessToken,
    });

    return this.http.post<any>(url, user, {
      headers: headers
    }).toPromise();
  }

  private async postDeleteUser(url, userId) {
    let userToken = JSON.parse(this.localStorage.get('userToken')) as ResponsePayload;
    let headers = new HttpHeaders({
      "Content-Type": 'application/json',
      "user-token": userToken.accessToken,
    });

    return this.http.post<any>(url, userId, {
      headers: headers
    }).toPromise();
  }

  private async userSyncStatus(url) {
    let userToken = JSON.parse(this.localStorage.get('userToken')) as ResponsePayload;
    let headers = new HttpHeaders({
      "Content-Type": 'application/json',
      "user-token": userToken.accessToken,
    });
    return this.http.post<any>(url, [], {
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

  private async getRequestAllCompresores(url) {
    let userToken = JSON.parse(this.localStorage.get('userToken')) as ResponsePayload;
    let headers = new HttpHeaders({
      "Content-Type": 'application/json',
      "user-token": userToken.accessToken,
    });

    return this.http.get<any>(url, {
      headers: headers
    }).toPromise();
  }

  private async postNewCompresor(url, compresor) {
    let userToken = JSON.parse(this.localStorage.get('userToken')) as ResponsePayload;
    let headers = new HttpHeaders({
      "Content-Type": 'application/json',
      "user-token": userToken.accessToken,
    });

    return this.http.post<any>(url, compresor, {
      headers: headers
    }).toPromise();
  }


  private async postNewMassCompresor(url, compresor) {
    let userToken = JSON.parse(this.localStorage.get('userToken')) as ResponsePayload;
    let headers = new HttpHeaders({
      "Content-Type": 'application/json',
      "user-token": userToken.accessToken,
    });

    return this.http.post<any>(url, compresor, {
      headers: headers
    }).toPromise();
  }


  private async postUpdateCompresor(url, compresor) {
    let userToken = JSON.parse(this.localStorage.get('userToken')) as ResponsePayload;
    let headers = new HttpHeaders({
      "Content-Type": 'application/json',
      "user-token": userToken.accessToken,
    });
    return this.http.post<any>(url, compresor, {
      headers: headers
    }).toPromise();
  }

  private async postDeleteCompresor(url, compresorId) {
    let userToken = JSON.parse(this.localStorage.get('userToken')) as ResponsePayload;
    let headers = new HttpHeaders({
      "Content-Type": 'application/json',
      "user-token": userToken.accessToken,
    });
    return this.http.post<any>(url, compresorId, {
      headers: headers
    }).toPromise();
  }

  /* RECORD REQUESTS */

  private async postRequestAllRecords(url) {
    let userToken = JSON.parse(this.localStorage.get('userToken')) as ResponsePayload;
    let headers = new HttpHeaders({
      "Content-Type": 'application/json',
      "user-token": userToken.accessToken,
    });
    return this.http.get<any>(url, {
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

  private async postUpdateStatusRecord(url, data) {
    let userToken = JSON.parse(this.localStorage.get('userToken')) as ResponsePayload;
    let headers = new HttpHeaders({
      "Content-Type": 'application/json',
      "user-token": userToken.accessToken,
    });
    return this.http.post<any>(url, data, {
      headers: headers
    }).toPromise();
  }

  /*
    USER QUERIES
    *
    */

  async login(user) {
    return await this.postRequestLogin(`${environment.serverUrl}/api/entryUser/loginAdmin`, user);
  }

  async getAllUsers() {
    const response = await this.getRequestAllUsers(`${environment.serverUrl}/api/admin/getUsers`);
    return response.users;
  }

  async createUser(user) {
    return await this.postRequestRegisterUserGeneral(`${environment.serverUrl}/api/entryUser/register`, user);
  }

  async newUser(user: UserModel) {
    const response = await this.postNewUser(`${environment.serverUrl}/api/admin/registerUser`, user);
    return response;
  }

  async updateUser(user: UserModel) {
    const response = await this.postUpdateUser(`${environment.serverUrl}/api/admin/updateUser`, user);
    return response;
  }

  async deleteUser(user: UserModel) {
    const userId = {
      id: user.id
    };
    const response = await this.postDeleteUser(`${environment.serverUrl}/api/admin/deleteUser`, userId);
    return response;
  }

  async updateSyncStatus(type) {
    let url = "";
    if (type === 'enable') {
      url = 'enableUserSync'
    } else {
      url = 'disableUserSync'
    }
    const response = await this.userSyncStatus(`${environment.serverUrl}/api/admin/` + url);
    return response;
  }

  /*
    COMPRESOR QUERIES
    *
    */

  async getAllCompresores() {
    const response = await this.getRequestAllCompresores(`${environment.serverUrl}/api/admin/getCompresores`);
    return response.compresores;
  }

  async newCompresor(compresor: Compresor) {
    const response = await this.postNewCompresor(`${environment.serverUrl}/api/admin/newCompresor`, compresor);
    return response;
  }


  async newMassCompresor(compresor: Compresor) {
    const response = await this.postNewMassCompresor(`${environment.serverUrl}/api/admin/newMassCompresor`, compresor);
    return response;
  }

  async updateCompresor(compresor: Compresor) {
    const response = await this.postUpdateCompresor(`${environment.serverUrl}/api/admin/updateCompresor`, compresor);
    return response;
  }

  async deleteCompresor(compresor: Compresor) {
    const compresorId = {
      id: compresor.id
    }
    const response = await this.postDeleteCompresor(`${environment.serverUrl}/api/admin/deleteCompresor`, compresorId);
    return response;
  }

  /*
    RECORD QUERIES
  *
  */

  async getRecordsForUser(username: string) {
    const usernameObject = {
      username: username
    }
    const response = await this.postRequestUserRecords(`${environment.serverUrl}/api/record/getRecordsForUser`, usernameObject);
    return response.records;
  }

  async getAllRecords() {
    const response = await this.postRequestAllRecords(`${environment.serverUrl}/api/admin/getRecords`);
    return response.records;
  }

  async updateRecordStatus(recordStatus: string, recordId) {
    const recordInfo = {
      status: recordStatus,
      id: recordId
    };
    const response = await this.postUpdateStatusRecord(`${environment.serverUrl}/api/admin/updateStatusRecord`, recordInfo)
    return response;
  }

}
