import { Component, Input, Output, EventEmitter, OnChanges } from "@angular/core";
import { UserModel } from '../../models/user.model';

@Component({
  selector: "app-register-tile",
  templateUrl: "./register-tile.component.html",
  styleUrls: [ "./register-tile.component.scss" ],
})
export class RegisterTileComponent implements OnChanges {
  @Input() isLoading: boolean;
  @Output() goToRegisterClicked = new EventEmitter();

  ngOnChanges() { }

  goToRegister() {
    this.goToRegisterClicked.emit();
  }
}
