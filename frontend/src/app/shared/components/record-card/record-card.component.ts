import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Constants } from 'src/app/shared/Constants/Constants';
import { Record } from '../../models/record.model';


@Component({
  selector: 'app-record-card',
  templateUrl: 'record-card.component.html',
  styleUrls: ['record-card.component.scss'],
})
export class RecordCardComponent implements OnChanges {

  @Input() record: Record;

  constructor() { }


  ngOnChanges() {

  }

}
