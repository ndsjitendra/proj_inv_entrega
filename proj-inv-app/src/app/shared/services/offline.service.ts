import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

declare const window: any // window object

@Injectable({
  providedIn: 'root'
})
export class OfflineService {
  private internalConnectionChanged = new Subject<boolean>();

  constructor() {
    window.addEventListener('online', () => this.updateOnlineStatus());
    window.addEventListener('offline', () => this.updateOnlineStatus());
  }

  get connectionChanged() {
    return this.internalConnectionChanged.asObservable();
  }

  get isOnline() {
    return !!navigator.onLine;
  }

  private updateOnlineStatus() {
    this.internalConnectionChanged.next(navigator.onLine);
  }
}
