import { Component, Input } from '@angular/core';
import { UserModel } from 'src/app/shared/models/user.model';


@Component({
  selector: 'app-user-card',
  templateUrl: 'user-card.component.html',
  styleUrls: ['user-card.component.scss'],
})
export class UserCardComponent {

  @Input() user: UserModel

  constructor() { }

}
