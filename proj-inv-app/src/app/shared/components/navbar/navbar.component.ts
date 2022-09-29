import { Component, OnInit, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';


declare const electron;

@Component({
  selector: 'app-nav-bar',
  templateUrl: 'navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})

export class NavBarComponent implements OnChanges {
  @Output() logoutEvent = new EventEmitter<string>();
  @Output() redirectEvent = new EventEmitter<string>();
  @Input() tab: string = "";


  constructor() { }

  ngOnChanges() {
  }

  logout() {
    this.logoutEvent.emit();
  }

  redirect(type: string) {
    this.redirectEvent.emit(type);
  }


}
