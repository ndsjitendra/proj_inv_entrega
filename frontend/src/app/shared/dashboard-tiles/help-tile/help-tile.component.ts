import { Component, Input, Output, EventEmitter, OnChanges } from "@angular/core";

@Component({
  selector: "app-help-tile",
  templateUrl: "./help-tile.component.html",
  styleUrls: [ "./help-tile.component.scss" ],
})
export class HelpTileComponent implements OnChanges {
  @Input() isLoading: boolean;
  @Output() goToHelpClicked = new EventEmitter();

  ngOnChanges() { }

  goToHelp() {
    this.goToHelpClicked.emit();
  }
}
