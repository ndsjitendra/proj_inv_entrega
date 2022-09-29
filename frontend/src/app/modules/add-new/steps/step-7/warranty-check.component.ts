import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup } from "@angular/forms";
import { Subscription } from 'rxjs';
import { AddNewStateService } from '../../services/add-new-state.service';


@Component({
  selector: 'app-warranty-check',
  templateUrl: './warranty-check.component.html',
  styleUrls: ['./warranty-check.component.scss']
})
export class WarrantyCheckComponent implements OnInit, OnDestroy {
  @Output() checklistCompletedEvent: EventEmitter<any> = new EventEmitter();
  @Input() validationIssues: boolean = false;

  dataInitialized: boolean = false;
  formChangesSubscription: Subscription = null;
  addNewForm: FormGroup;


  constructor(
    private addNewStateService: AddNewStateService,
  ) {}

  ngOnInit() {
    this.dataInitialized = false;
    this.addNewForm = this.addNewStateService.recordForm;
    this.dataInitialized = true;
  }

  ngOnDestroy() {
    if (this.formChangesSubscription) {
      this.formChangesSubscription.unsubscribe();
      this.formChangesSubscription = null;
    }
  }

}
