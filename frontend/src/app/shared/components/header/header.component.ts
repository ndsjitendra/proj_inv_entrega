import { Component, EventEmitter, Input, Output } from '@angular/core';


@Component({
  selector: 'app-header',
  templateUrl: 'header.component.html',
  styleUrls: ['header.component.scss'],
})
export class HeaderComponent {
  @Output() exitEvent: EventEmitter<any> = new EventEmitter();
  @Input() title: string
  @Input() inModule: boolean = false;
  @Input() userPage: boolean = false;
  @Input() userImg: string = "";

  constructor() { }

  exit() {
    this.exitEvent.emit()
  }

}
