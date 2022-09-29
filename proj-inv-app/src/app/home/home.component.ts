import { Component, OnChanges, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { Compresor } from '../shared/models/compresor.model';
import { Actividad, Respuesta } from '../shared/models/Constants';
import { Record } from '../shared/models/record.model';
import { UserModel } from '../shared/models/user.model';
import { ServerService } from '../shared/services/server.service';
import * as date_fns from 'date-fns';
import { ResponsePayload } from '../shared/models/payload.model';
import { UserService } from '../shared/services/user.service';
import { CompresorStateService } from '../shared/services/getItem/compresor-state.service';
import { UserStateService } from '../shared/services/getItem/user-state.service';
import { RecordStateService } from '../shared/services/getItem/record-state.service';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnChanges {

  dataInitialized: boolean = false;
  loading: boolean = false;
  dataType: string = "";
  records: Record[] = [];
  compresores: Compresor[];
  users: UserModel[];
  showAlert: boolean = false;
  alertType: string;
  alertMessage: string;


  public get userToken(): ResponsePayload {
    return this.userService.userToken;
  }

  recordColumns: Array<keyof Record | 'action'> = [
    'compresorModel',
    'compresorSerial',
    'username',
    'status',
    'createdAt',
    'action'
  ];

  compresorColumns: Array<keyof Compresor | 'action'> = [
    'modelo',
    'tipo',
    'desc_prod',
    'action'
  ];

  userColumns: Array<keyof UserModel | 'action'> = [
    'foto',
    'nombre',
    'matricula',
    'username',
    'experiencia',
    'action'
  ];

  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = this.recordColumns;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor(
    private serverService: ServerService,
    private spinnerService: NgxSpinnerService,
    private router: Router,
    private userService: UserService,
    private compresorStateService: CompresorStateService,
    private userStateService: UserStateService,
    private recordStateService: RecordStateService
  ) { }

  async ngOnInit() {
    this.dataInitialized = false;
    if (this.userService.getTab()) {
      this.dataType = this.userService.getTab();
    } else {
      this.dataType = 'registros';
    }
    this.dataSource = new MatTableDataSource([]);
    await this.getData();
    this.dataInitialized = true;

  }

  async ngOnChanges() {
    this.loading = true;
    if (!this.dataSource) {
      this.dataSource = new MatTableDataSource([]);
    }
    this.dataInitialized = false;
    await this.getData();
    this.filter(this.dataType);
    this.dataInitialized = true;
    this.loading = false;
  }

  async getData() {
    this.spinnerService.show();
    const records = await this.serverService.getAllRecords();
    this.records = records;
    const compresores = await this.serverService.getAllCompresores();
    this.compresores = compresores;
    const users = await this.serverService.getAllUsers();
    this.users = users;
    this.filter(this.dataType);
    this.spinnerService.hide();
  }

  filter(type) {
    let data;
    this.dataType = type;
    switch (this.dataType) {
      case 'registros':
        data = this.records;
        this.displayedColumns = this.recordColumns;
        break;
      case 'compresores':
        data = this.compresores;
        this.displayedColumns = this.compresorColumns;
        break;
      case 'usuarios':
        data = this.users;
        this.displayedColumns = this.userColumns;
        break;
    }
    this.populateDataSource(data);
  }

  populateDataSource(data: any) {
    this.dataSource.filterPredicate = (element: any, filter: string) => {
      const query = filter.trim().toLowerCase();
      const filterResults = this.displayedColumns.map((columnName) => {
        const field = element[columnName];
        if (field) {
          if (field instanceof Date) {
            return date_fns
              .format(field, "dd/MM/yyyy")
              .trim()
              .toLowerCase()
              .includes(query);
          } else if (typeof field === "string" && !isNaN(Date.parse(field))) {
            return date_fns
              .format(new Date(field), "dd/MM/yyyy")
              .trim()
              .toLowerCase()
              .includes(query);
          } else if (typeof field === "string") {
            return field.trim().toLowerCase().includes(query);
          } else if (typeof field === "number") {
            return field.toString().includes(query);
          }
        } else {
          return false;
        }
      });
      const result = filterResults.find((r) => r) || false;
      return result;
    };

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.data = data;
  }

  applyFilter(filterValue) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  getRow(row) {
    switch (this.dataType) {
      case 'registros':
        this.getRecord(row);
        break;
      case 'compresores':
        this.getCompresor(row);
        break;
      case 'usuarios':
        this.getUser(row);
        break;
    }
  }

  getCompresor(compresor: Compresor) {
    this.compresorStateService.set(compresor);
    this.router.navigateByUrl('compresor');
  }

  getUser(user: UserModel) {
    this.userStateService.set(user);
    this.router.navigateByUrl('user');
  }

  getRecord(record: Record) {
    this.recordStateService.set(record);
    this.router.navigateByUrl('record');
  }

  async deleteRow(row) {
    this.spinnerService.show();
    this.dataInitialized = false;
    let result;
    switch (this.dataType) {
      case 'usuarios':
        result = window.confirm("¿Seguro que desea eliminar este usuario?");
        if (result) {
          await this.serverService.deleteUser(row);
        }
        break;
      case 'compresores':
        result = window.confirm("¿Seguro que desea eliminar este compresor?");
        if (result) {
          await this.serverService.deleteCompresor(row);
        }
        break;
    }
    await this.getData();
    this.dataInitialized = true;
    this.spinnerService.hide();
  }

  newData() {
    switch (this.dataType) {
      case 'registros':
        this.newRecord();
        break;
      case 'compresores':
        this.newCompresor();
        break;
      case 'usuarios':
        this.newUser();
        break;
    }
  }

  newCompresor() {
    this.compresorStateService.clear();
    this.compresorStateService.turnOnCompresorInProgress();
    this.router.navigateByUrl('compresor');
  }

  newUser() {
    this.userStateService.turnOnUserInProgress();
    this.userStateService.clear();
    this.router.navigateByUrl('user');
  }

  newRecord() {
    this.recordStateService.turnOnRecordInProgress();
    this.recordStateService.clear();
    this.router.navigateByUrl('record');
  }

  async enableUserSync() {
    const result = window.confirm("¿Seguro que habilitar la sincronización para los usuarios?");
    if (result) {
      this.spinnerService.show();
      await this.serverService.updateSyncStatus('enable');
      this.enableAlert("success", "Habilitado!");
      this.spinnerService.hide();
    } else {
      return;
    }
  }

  async disableUserSync() {
    const result = window.confirm("¿Seguro que deshabilitar la sincronización para los usuarios?");
    if (result) {
      this.spinnerService.show();
      await this.serverService.updateSyncStatus('disable');
      this.enableAlert("success", "Deshabilitado!");
      this.spinnerService.hide();
    } else {
      return;
    }
  }

  enableAlert(type: string, message: string) {
    if (!this.showAlert) {
      this.alertType = type
      this.alertMessage = message;
      this.showAlert = true;
      setTimeout(() => {
        this.showAlert = false;
        this.alertMessage = "";
        this.alertType = "";
      }, 1250);
    }
  }
}
