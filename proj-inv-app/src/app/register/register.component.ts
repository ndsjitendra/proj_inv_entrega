import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ServerService } from '../shared/services/server.service';
import { ResponsePayload } from '../shared/models/payload.model';
import { NgxSpinnerService } from 'ngx-spinner';
import { LocalStorageService } from '../shared/services/localStorage.service';
import { UserModel } from '../shared/models/user.model';
import { Actividad, Constants } from '../shared/models/Constants';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  @ViewChild("fileDropRef", { static: false }) fileDropEl: ElementRef;

  estados = Constants.estados;
  step: number = 1;
  validationIssues: boolean = false;
  mismatchPassword: boolean = false;
  userAlreadyExists: boolean = false;
  registerForm: FormGroup;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private serverService: ServerService,
    private spinnerService: NgxSpinnerService,
    private localStorage: LocalStorageService
  ) { }

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.registerForm = this.formBuilder.group({
      nombre: ["", Validators.required],
      apellido: ["", Validators.required],
      telefono: ["", Validators.required],
      estado: ["", Validators.required],
      ciudad: ["", Validators.required],
      cp: ["", Validators.required],
      calleYNum: ["", Validators.required],
      actividad: ["", Validators.required],
      experiencia: ["", Validators.required],
      utilizadoCompresor: ["", Validators.required],
      recibirInformacion: ["", Validators.required],
      username: ["", Validators.email],
      password: ["", [Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[A-Za-z\d$@$!%*?&].{8,}')]],
      confirmarPassword: ["", Validators.required],
      foto: ["", Validators.required]
    });
  }

  async register() {
    this.validationIssues = false;
    this.mismatchPassword = false;
    this.userAlreadyExists = false;
    if (this.registerForm.value.password !== this.registerForm.value.confirmarPassword) {
      this.mismatchPassword = true;
      this.registerForm.controls.password.setValue('');
      this.registerForm.controls.confirmarPassword.setValue('');
      return;
    }
    if (this.registerForm.valid) {
      this.spinnerService.show();
      const user = new UserModel();
      user.nombre = this.registerForm.value.nombre;
      user.apellido = this.registerForm.value.apellido;
      user.telefono = this.registerForm.value.telefono;
      user.estado = this.registerForm.value.estado;
      user.ciudad = this.registerForm.value.ciudad;
      user.cp = this.registerForm.value.cp;
      user.calleYnum = this.registerForm.value.calleYNum;
      user.actividad = this.registerForm.value.actividad;
      user.experiencia = this.registerForm.value.experiencia;
      user.utilizadoCompresor = this.registerForm.value.utilizadoCompresor;
      user.recibirInformacion = this.registerForm.value.recibirInformacion;
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

      console.log("USER: ", user);
      const response = await this.serverService.createUser(user);
      if (response['resp'] === 'User already exists') {
        this.userAlreadyExists = true;
        return;
      }

      if (response) {
        this.router.navigateByUrl('login');
      }
      this.spinnerService.hide();
    } else {
      this.validationIssues = true;
    }
  }

  goHome() {
    this.router.navigateByUrl('home');
  }

  goRegister() {

  }

  changeSelect(event: any, type: string) {
    switch (type) {
      case 'estado':
        this.registerForm.controls.estado.setValue(event.value);
        break;
      case 'actividad':
        this.registerForm.controls.actividad.setValue(event.value);
        break;
      case 'utilizadoCompresor':
        this.registerForm.controls.utilizadoCompresor.setValue(event.value);
        break;
      case 'recibirInformacion':
        this.registerForm.controls.recibirInformacion.setValue(event.value);
        break;
    }

  }

  validateNext() {
    this.validationIssues = false;
    this.mismatchPassword = false;
    this.userAlreadyExists = false;
    switch (this.step) {
      case 1:
        if (this.registerForm.value.nombre !== '' && this.registerForm.value.apellido !== '' && this.registerForm.value.telefono !== '' && this.registerForm.value.estado !== '' && this.registerForm.value.ciudad !== '' && this.registerForm.value.cp !== '' && this.registerForm.value.calleYNum !== '') {
          this.step++;
        } else {
          this.validationIssues = true;
        }
        break;
      case 2:
        if (this.registerForm.value.actividad !== '' && this.registerForm.value.experiencia !== '' && this.registerForm.value.utilizadoCompresor !== '' && this.registerForm.value.recibirInformacion !== '') {
          this.step++;
        } else {
          this.validationIssues = true;
        }
        break;
      case 3:
        if (this.registerForm.value.foto !== '') {
          this.step++;
        } else {
          this.validationIssues = true;
        }
        break;
    }
  }

  returnStep() {
    this.step = this.step - 1;
  }

  /**
  * handle file from browsing
  */
  fileBrowseHandler(file) {
    this.addFile(file.target.files[0]);
  }

  addFile(file: File) {
    if (file && (file.type !=='image/png' && file.type !=='image/jpeg')) {
      this.enableAlert("Archivo no es una imagen!");
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.registerForm.controls.foto.setValue(reader.result);
  };
  }

  enableAlert(message: string) {
    alert(message);
  }

  deletePhoto() {
    this.registerForm.controls.foto.reset();
  }

  selectFile() {
    const element = document.getElementById("select-input");
    element.click();
  }

}
