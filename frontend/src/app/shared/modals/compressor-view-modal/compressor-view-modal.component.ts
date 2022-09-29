import { Component, Input, OnChanges } from "@angular/core";
import { ModalController } from '@ionic/angular';
import { Compresor } from '../../models/compresor.model';

@Component({
  selector: "app-compressor-view-modal",
  templateUrl: "./compressor-view-modal.component.html",
  styleUrls: [ "./compressor-view-modal.component.scss" ],
})
export class CompressorViewModalComponent implements OnChanges {
  @Input() isLoading: boolean;
  @Input() compressor: Compresor;

  constructor( 
    private modalCtrl: ModalController
  ){}

  ngOnChanges() { }


  close() {
    this.modalCtrl.dismiss();
  }
}
