import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup } from "@angular/forms";
import { Subscription } from 'rxjs';
import { HelpService } from 'src/app/shared/services/server-connection/help.service';
import { AddNewStateService } from '../../services/add-new-state.service';


@Component({
  selector: 'app-checklist',
  templateUrl: './checklist.component.html',
  styleUrls: ['./checklist.component.scss']
})
export class ChecklistComponent implements OnInit, OnDestroy {
  @Output() checklistCompletedEvent: EventEmitter<any> = new EventEmitter();
  @Input() validationIssues: boolean = false;

  dataInitialized: boolean = false;
  formChangesSubscription: Subscription = null;
  checklistForm: FormGroup;
  addNewForm: FormGroup;


  constructor(
    private addNewStateService: AddNewStateService,
    private helpService: HelpService
  ) {}

  ngOnInit() {
    this.dataInitialized = false;
    this.addNewForm = this.addNewStateService.recordForm;
    if (!this.addNewStateService.checklistForm) {
      this.addNewStateService.createChecklistForm();
      this.checklistForm = this.addNewStateService.checklistForm;
    } else {
      this.checklistForm = this.addNewStateService.checklistForm;
    }
    this.formChangesSubscription = this.checklistForm.valueChanges.subscribe(() => {
      this.checklistCompleted();
    });
    this.saveState();
    this.dataInitialized = true;
  }

  ngOnDestroy() {
    if (this.formChangesSubscription) {
      this.formChangesSubscription.unsubscribe();
      this.formChangesSubscription = null;
    }
  }

  checklistCompleted() {
    if (this.checklistForm.valid) {
      this.addNewForm.controls.checklistComplete.setValue(true);
      this.saveState();
    } else {
      this.addNewForm.controls.checklistComplete.reset();
      this.saveState();
    }
  }

  onFormChanges() {
    this.saveState();
  }

  saveState() {
    this.addNewStateService.saveState();
  }

  async openPDF() {
    let data = null;
    let response = null;
    data = {
      fileLocation: 'terms-and-conditions/termsAndConditions.pdf'
    };
    response = await this.helpService.getHelpUserEntryPDF(data);
    window.open(response.succ);
  }

}
