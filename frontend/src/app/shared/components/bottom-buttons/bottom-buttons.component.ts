import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'lib-bottom-buttons',
  templateUrl: 'bottom-buttons.component.html',
  styleUrls: ['./bottom-buttons.component.scss']
})

export class BottomButtonsComponent implements OnInit {
  @Output() back: EventEmitter<void> = new EventEmitter();
  @Output() next: EventEmitter<void> = new EventEmitter();

  @Input() showButtons: boolean;
  @Input() isDisabled: boolean;
  @Input() disableSubmit: boolean;
  @Input() loadingCheck: boolean;
  @Input() nextbuttonTitle: string;
  @Input() nextTitle: string;
  @Input() nextButtonHidden: boolean = false;
  @Input() disableBackButton: boolean = false;
  @Input() backbuttonName: string = 'Regresar';

  constructor() { }

  ngOnInit() { }

  previousStep() {
    if (this.isDisabled) {
      return;
    }
    this.back.next();
  }

  nextStep() {
    if (this.disableSubmit) {
      return;
    }
    this.next.next();
  }
}
