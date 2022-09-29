import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Record } from 'src/app/shared/models/record.model';
import { RecordStateSevice } from 'src/app/shared/services/record-state.service';

@Component({
  selector: 'app-warranty',
  templateUrl: 'warranty.component.html',
  styleUrls: ['warranty.component.scss'],
})
export class WarrantyComponent implements OnInit {

  title: string = "GARANTÍA EXTENDIDA";
  loading: boolean = false;
  record: Record = null;

  constructor(
    private recordService: RecordStateSevice,
    private navCtrl: NavController
  ) { }

  async ngOnInit() {
    this.loading = true;
    this.record = this.recordService.get();
    this.loading = false;
  }

  cancel() {
    this.recordService.clear();
    this.navCtrl.navigateBack('home');
  }
}
