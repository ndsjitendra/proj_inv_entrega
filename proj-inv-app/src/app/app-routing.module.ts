import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { UserPageComponent } from './home/user/user.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthGuard } from './shared/services/auth.guard';

const routes: Routes = [

  {
    path: "home", canActivate: [AuthGuard], component: HomeComponent
  },
  {
    path: "login", component: LoginComponent,
  },
  {
    path: "register", component: RegisterComponent,
  },
  {
    path: "compresor", canActivate: [AuthGuard], loadChildren: () => import('./home/compresor/compresor.module').then(m => m.CompresorPageModule)
  },
  {
    path: "record", canActivate: [AuthGuard], loadChildren: () => import('./home/record/record.module').then(m => m.RecordPageModule)
  },
  {
    path: "user", canActivate: [AuthGuard], loadChildren: () => import('./home/user/user.module').then(m => m.UserPageModule)
  },
  {
    path: "upload", canActivate: [AuthGuard], loadChildren: () => import('./home/upload/upload.module').then(m => m.UploadPageModule)
  },
  { path: "", redirectTo: "/home", pathMatch: "full" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
