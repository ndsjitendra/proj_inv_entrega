import { Component, Input, Output, EventEmitter, OnChanges } from "@angular/core";
import { UserModel } from '../../models/user.model';

@Component({
  selector: "app-user-tile",
  templateUrl: "./user-tile.component.html",
  styleUrls: [ "./user-tile.component.scss" ],
})
export class UserTileComponent implements OnChanges {
  @Input() user: UserModel;
  @Input() isLoading: boolean;
  @Output() goToUserPageEvent = new EventEmitter();

  ngOnChanges() { }

  goToUserPage() {
    this.goToUserPageEvent.emit();
  }
}
