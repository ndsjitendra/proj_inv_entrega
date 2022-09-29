import { Component, OnChanges, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ServerService } from 'src/app/shared/services/server-connection/server.services';
import { Actividad, Constants } from 'src/app/shared/Constants/Constants';
import { UserModel } from 'src/app/shared/models/user.model';
import { CameraService } from 'src/app/shared/services/camera.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastService } from 'src/app/shared/services/toast.service';
import { ToastMessage } from 'src/app/shared/interfaces/toast';
import { Subscription } from 'rxjs';
import { AlertService } from 'src/app/shared/services/alert.service';
import { Alert } from 'src/app/shared/models/alert.model';
import { HelpService } from 'src/app/shared/services/server-connection/help.service';

@Component({
  selector: 'app-login',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit, OnChanges {

  registerForm: FormGroup;
  dataInitialized: boolean;
  estados = Constants.estados;
  bancos = Constants.bancos;
  formChangesSubscription: Subscription = null;
  step: number = 1;
  validationIssues: boolean = false;
  mismatchPassword: boolean = false;
  userAlreadyExists: boolean = false;
  personaOptions = [
    { value: 'moral', label: 'Persona Moral' },
    { value: 'fisica', label: 'Persona Física' }
  ];
  actividadOptions = [
    'Técnico Independiente',
    'Empresa de Mtto. y Servicio'
  ];
  yesNoOptions = [
    'Si',
    'No'
  ];


  get image(): string {
    return this.cameraService.currentImage
  }

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private queryService: ServerService,
    private cameraService: CameraService,
    private spinnerService: NgxSpinnerService,
    private toastService: ToastService,
    private alertService: AlertService,
    private helpService: HelpService
  ) {

  }

  ngOnInit() {
    this.dataInitialized = false;
    this.spinnerService.show();
    this.createForm();
    this.formChangesSubscription = this.registerForm.valueChanges.subscribe(() => {
    });
    this.step = 1;
    this.dataInitialized = true;
    this.spinnerService.hide();
  }

  ngOnChanges() {
    if (this.image) {
      this.registerForm.controls.foto.setValue(this.image);
    }
  }

  createForm() {
    this.registerForm = this.formBuilder.group({
      nombre: [null, Validators.required],
      apellido: [null, Validators.required],
      telefono: [null, Validators.required],
      estado: [null, Validators.required],
      ciudad: [null, Validators.required],
      cp: [null, Validators.required],
      calleYNum: [null, Validators.required],
      persona: [null, Validators.required],
      tarjeta: [null, Validators.required],
      clabe: [null],
      banco:  [null, Validators.required],
      rfc: [null, Validators.compose([Validators.required, Validators.minLength(12), Validators.maxLength(13)])],
      actividad: [null, Validators.required],
      experiencia: [null, Validators.required],
      utilizadoCompresor: [null, Validators.required],
      recibirInformacion: [null, Validators.required],
      username: [null,  Validators.compose([Validators.required, Validators.email])],
      password: [null, [Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[A-Za-z\d$@$!%*?&].{8,}')]],
      confirmarTerminosPrivacidad: [null, Validators.required],
      confirmarPassword: [null, Validators.required],
      foto: [null, Validators.required]
    });
  }

  async register() {
    this.mismatchPassword = false;
    this.userAlreadyExists = false;

    if (!this.registerForm.controls.username.valid || !this.registerForm.controls.password.valid || !this.registerForm.controls.confirmarPassword.valid || !this.registerForm.controls.confirmarTerminosPrivacidad.valid) {
      this.validationIssues = true;
      await this.invalidForm();
      return;
    }

    if (this.registerForm.value.password !== this.registerForm.value.confirmarPassword) {
      this.mismatchPassword = true;
      this.registerForm.controls.password.setValue('');
      this.registerForm.controls.confirmarPassword.setValue('');
      return;
    }
    if (this.registerForm.valid) {
      let date = new Date();
      this.spinnerService.show();
      const user = new UserModel();
      user.nombre = this.registerForm.value.nombre;
      let localId = user.nombre.substring(0, 4) + date.getTime();
      user.localId = localId.toLowerCase();
      user.apellido = this.registerForm.value.apellido;
      user.telefono = this.registerForm.value.telefono;
      user.estado = this.registerForm.value.estado;
      user.ciudad = this.registerForm.value.ciudad;
      user.cp = this.registerForm.value.cp;
      user.persona = this.registerForm.value.persona;
      user.banco = this.registerForm.value.banco;
      user.tarjeta = this.registerForm.value.tarjeta;
      user.clabe = this.registerForm.value.clabe;
      user.rfc = this.registerForm.value.rfc;
      user.calleYnum = this.registerForm.value.calleYNum;
      user.actividad = this.registerForm.value.actividad;
      user.experiencia = this.registerForm.value.experiencia;
      user.utilizadoCompresor = this.registerForm.value.utilizadoCompresor;
      user.recibirInformacion = this.registerForm.value.recibirInformacion;
      user.terminosPrivacidad = this.registerForm.value.confirmarTerminosPrivacidad;
      user.foto = this.registerForm.value.foto;
      if (user.actividad === Actividad.Independiente) {
        user.tipoDeCuenta = 1;
      } else {
        if (user.actividad === Actividad.Empresa) {
          user.tipoDeCuenta = 2;
        }
      }
      user.username = this.registerForm.value.username;
      user.password = this.registerForm.value.password;
      const response = await this.queryService.createUser(user);
      if (response['resp'] === 'User already exists') {
        this.userAlreadyExists = true;
        this.spinnerService.hide();
        return;
      }
      if (response) {
        this.registerForm.reset();
        this.router.navigateByUrl('login');
        this.registerSuccess();
      } else {
        this.registerError();
      }
      this.spinnerService.hide();
    }
  }

  async validateNext() {
    this.validationIssues = false;
    switch (this.step) {
      case 1:
        if (this.registerForm.controls.nombre.valid && this.registerForm.controls.apellido.valid && this.registerForm.controls.telefono.valid && this.registerForm.controls.estado.valid && this.registerForm.controls.ciudad.valid && this.registerForm.controls.cp.valid && this.registerForm.controls.calleYNum.valid) {
          this.step++;
        } else {
          this.validationIssues = true;
        }
        break;
      case 2:
        if (this.registerForm.controls.persona.valid && this.registerForm.controls.tarjeta.valid && this.registerForm.controls.banco.valid && this.registerForm.controls.rfc.valid) {
          this.step++;
        } else {
          this.validationIssues = true;
        }
        break;
      case 3:
        if (this.registerForm.controls.actividad.valid && this.registerForm.controls.experiencia.valid && this.registerForm.controls.utilizadoCompresor.valid && this.registerForm.controls.recibirInformacion.valid) {
          this.step++;
        } else {
          this.validationIssues = true;
        }
        break;
      case 4:
        if (this.registerForm.controls.foto.valid) {
          this.step++;
        } else {
          this.validationIssues = true;
        }
        break;
    }
    if (this.validationIssues) {
      await this.invalidForm();
      return;
    }
  }

  deletePhoto() {
    this.registerForm.controls.foto.reset();
  }

  returnStep() {
    this.step = this.step - 1;
  }

  returnBack() {
    this.router.navigateByUrl('login');
  }

  async invalidForm() {
    let alertValues = new Alert();
    alertValues.header = 'Error';
    alertValues.message = 'Existen errores dentro del formulario!'
    await this.alertService.showAlert(alertValues);
  }

  async registerSuccess() {
    const toast: ToastMessage = {
      message: 'Registro exitoso',
      position: 'bottom',
      color: 'success',
      duration: 2000
    };
    this.toastService.presentToast(toast);
  }

  async registerError() {
    const toast: ToastMessage = {
      message: 'Existe un error en los datos',
      position: 'bottom',
      color:'danger',
      duration: 2000
    };
    this.toastService.presentToast(toast);
  }

  async openPDF(type: string) {
    let data = null;
    let response = null;
    switch (type) {
      case 'terms':
        data = {
          fileLocation: 'terms-and-conditions/termsAndConditions.pdf'
        };
        break;
      case 'privacy':
        data = {
          fileLocation: 'terms-and-conditions/privacy.pdf'
        };
        break;
    }
    response = await this.helpService.getHelpUserEntryPDF(data);
    window.open(response.succ);
  }
}
