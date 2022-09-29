import { Component, Input, Output, EventEmitter, OnChanges } from "@angular/core";
import { Constants } from '../../Constants/Constants';
import { Record } from '../../models/record.model';

@Component({
  selector: "app-record-list-tile",
  templateUrl: "./record-list-tile.component.html",
  styleUrls: [ "./record-list-tile.component.scss" ],
})
export class RecordListTileComponent implements OnChanges {
  @Output() goToRecordHistoryClicked = new EventEmitter();
  @Output() viewRecordClicked = new EventEmitter();
  @Input() recordList: Record[];
  @Input() isLoading: boolean;

  dateFormat: string = Constants.DateFormat;

  ngOnChanges() {
  }

   goToRecordHistory() {
    this.goToRecordHistoryClicked.emit();
  }

  viewRecord(record) {
    this.viewRecordClicked.emit(record);
  }
}
