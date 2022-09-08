import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './modules/login/login.component';
import { RegisterComponent } from './modules/register/register.component';
import { AuthGuard } from './shared/services/auth.guard';

const routes: Routes = [
  {
    path: '', redirectTo: 'hub', pathMatch: 'full'
  },
  {
    path: 'hub', canActivate: [AuthGuard], loadChildren: () => import('./modules/hub/hub.module').then(m => m.HubModule)
  },
  {
    path: 'add-new', canActivate: [AuthGuard], loadChildren: () => import('./modules/add-new/add-new.module').then(m => m.AddNewModule)
  },
  {
    path: 'records', canActivate: [AuthGuard], loadChildren: () => import('./modules/records/records.module').then(m => m.RecordsModule)
  },
  {
    path: 'stats', canActivate: [AuthGuard], loadChildren: () => import('./modules/stats/stats.module').then(m => m.StatsModule)
  },
  {
    path: 'payments', canActivate: [AuthGuard], loadChildren: () => import('./modules/payments/payments.module').then(m => m.PaymentsModule)
  },
  {
    path: 'user', canActivate: [AuthGuard], loadChildren: () => import('./modules/user/user.module').then(m => m.UserModule)
  },
  {
    path: 'help', canActivate: [AuthGuard], loadChildren: () => import('./modules/help/help.module').then(m => m.HelpModule)
  },
  {
    path: 'login', component: LoginComponent
  },
  {
    path: 'register', component: RegisterComponent
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
