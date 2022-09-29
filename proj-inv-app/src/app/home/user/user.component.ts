import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserModel } from 'src/app/shared/models/user.model';
import { UserStateService } from 'src/app/shared/services/getItem/user-state.service';
import { ServerService } from 'src/app/shared/services/server.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-compresor',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserPageComponent implements OnInit {

  user: UserModel;
  dataInitialized: boolean = false;
  madeChanges: boolean = false;
  userForm: FormGroup;
  editCheck: boolean = false;
  validationIssues: boolean = false;
  submitCheck: boolean = false;

  newUser: boolean = false;

  showAlert: boolean = false;
  alertType: string;
  alertMessage: string;

  newUserCheck: boolean = false;

  constructor(
    private userStateService: UserStateService,
    private spinnerService: NgxSpinnerService,
    private router: Router,
    private formBuilder: FormBuilder,
    private serverService: ServerService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.dataInitialized = false;
    this.newUserCheck = false;
    this.editCheck = false;
    this.spinnerService.show();
    this.userService.setTab('usuarios');
    if (this.userStateService.get() && !this.userStateService.checkUserInProgress()) {
      this.user = this.userStateService.get();
      this.dataInitialized = true;
    } else {
      if (this.userStateService.checkUserInProgress()) {
        this.nuevoUsuario();
        this.dataInitialized = true;
      }
    }
    this.spinnerService.hide();
  }

  regresar() {
    this.userStateService.turnOffUserInProgress();
    this.router.navigateByUrl('home');
  }

  nuevoUsuario() {
    this.editCheck = true;
    this.newUserCheck = true;
    this.userForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      telefono: ['', Validators.required],
      createdAt: [],
      estado: ['', Validators.required],
      ciudad: ['', Validators.required],
      cp: ['', Validators.required],
      calleYnum: ['', Validators.required],
      actividad: ['', Validators.required],
      experiencia: ['', Validators.required],
      updatedAt: [],
      utilizadoCompresor: ['', Validators.required],
      recibirInformacion: ['', Validators.required],
      foto: [''],
      matricula: [''],
      username: ['', Validators.email],
      password: ['', Validators.required],
      tipoDeCuenta: [1]
    });
  }

  editar() {
    this.editCheck = true;
    this.userForm = this.formBuilder.group({
      nombre: [this.user.nombre, Validators.required],
      apellido: [this.user.apellido, Validators.required],
      telefono: [this.user.telefono, Validators.required],
      createdAt: [this.user.createdAt],
      estado: [this.user.estado, Validators.required],
      ciudad: [this.user.ciudad, Validators.required],
      cp: [this.user.cp, Validators.required],
      id: [this.user.id],
      calleYnum: [this.user.calleYnum, Validators.required],
      actividad: [this.user.actividad, Validators.required],
      experiencia: [this.user.experiencia, Validators.required],
      updatedAt: [this.user.updatedAt],
      utilizadoCompresor: [this.user.utilizadoCompresor, Validators.required],
      recibirInformacion: [this.user.recibirInformacion, Validators.required],
      foto: [this.user.foto, Validators.required],
      matricula: [this.user.matricula, Validators.required],
      username: [this.user.username, Validators.required],
    });
    this.userForm.controls.matricula.disable();
    this.userForm.controls.username.disable();
  }

  cancelEdit() {
    this.editCheck = false;
    this.userForm.reset();
  }

  async submit(type: string) {
    this.validationIssues = false;
    if (type === 'edit') {
      if (this.madeChanges) {
        if (this.userForm.valid) {
          try {
            const response = await this.serverService.updateUser(this.userForm.getRawValue());
            if (response.resp === 'success') {
              this.submitCheck = true;
              this.enableAlert("success", "Cambio realizado!");
              setTimeout(() => {
                this.submitCheck = false;
                this.regresar();
              }, 1250);
            }
            if (response.resp === 'exists') {
              this.enableAlert("error", "Usuario ya existe!");

            }
          } catch (err) {
            this.enableAlert("error", "Ocurrio un error");
          }
        } else {
          this.validationIssues = true;
          this.enableAlert("error", "Error en el Formulario");
        }
      } else {
        // Alert Pops up
        this.enableAlert("error", "No se realizaron cambios");
      }
    }
    if (type === 'new') {
      if (this.madeChanges) {
        if (this.userForm.valid) {
          try {
            const response = await this.serverService.newUser(this.userForm.getRawValue());
            if (response.resp === 'success') {
              this.submitCheck = true;
              this.enableAlert("success", "Nuevo Usuario Creado!");
              setTimeout(() => {
                this.submitCheck = false;
                this.regresar();
              }, 1250);
            }
            if (response.resp === 'exists') {
            }
          } catch (err) {
            this.enableAlert("error", "Ocurrio un error");
          }
        } else {
          this.validationIssues = true;
          this.enableAlert("error", "Error en el Formulario");
        }
      } else {
        // Alert Pops up
        this.enableAlert("error", "No se realizaron cambios");
      }
    }
  }

  change() {
    this.madeChanges = true;
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


  changeSelect(event: any, type: string) {
    this.change();
    switch (type) {
      case 'estado':
        this.userForm.controls.estado.setValue(event.value);
        break;
      case 'actividad':
        this.userForm.controls.actividad.setValue(event.value);
        break;
      case 'utilizadoCompresor':
        this.userForm.controls.utilizadoCompresor.setValue(event.value);
        break;
      case 'recibirInformacion':
        this.userForm.controls.recibirInformacion.setValue(event.value);
        break;
    }

  }
}
