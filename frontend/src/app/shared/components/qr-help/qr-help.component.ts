import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-qr-help',
  templateUrl: 'qr-help.component.html',
  styleUrls: ['qr-help.component.scss'],
})
export class QrHelpComponent {

  @Output() returnEvent: EventEmitter<any> = new EventEmitter();
  @Input() title = "";
  @Input() subtitle = "";
  @Input() img = "";
  @Input() return: boolean = true;

  constructor() { }

  async ngOnInit() {
  }

  returnHome() {
    this.returnEvent.emit();
  }
}
