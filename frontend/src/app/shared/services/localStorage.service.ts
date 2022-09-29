import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {


  constructor() {
  }

  public set(key: string, value: any) {
    localStorage.setItem(key, value);
  }

  public get(key: string) {
    return localStorage.getItem(key);
  }

  public remove(key) {
    localStorage.removeItem(key);
  }

  public clear() {
    localStorage.clear();
  }

}
