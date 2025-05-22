import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './screens/dashboard/dashboard.component';
import { ProfessionalComponent } from './screens/professional/professional.component';
import { ProfessionalAddComponent } from './screens/professional-add/professional-add.component';
import { LoginComponent } from './auth/login/login.component';
import { ClientComponent } from './screens/client/client.component';
import { ClientCrudComponent } from './screens/client-crud/client-crud.component';
import { EmployeeComponent } from './screens/employee/employee.component';
import { EmployeeCrudComponent } from './screens/employee-crud/employee-crud.component';
import { RegistryComponent } from './screens/registry/registry.component';
import { RegistryCrudComponent } from './screens/registry-crud/registry-crud.component';
import { OfficialComponent } from './screens/official/official.component';
import { OfficialCrudComponent } from './screens/official-crud/official-crud.component';
import { LogsComponent } from './screens/logs/logs.component';
import { PaymentComponent } from './screens/payment/payment.component';
import { SettingComponent } from './screens/setting/setting.component';
import { loginGuard } from './_guards/login/login.guard';
import { authGuard } from './_guards/auth/auth.guard';
import { adminGuard } from './_guards/admin/admin.guard';


const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [loginGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'professional', component: ProfessionalComponent, canActivate: [authGuard] },
  { path: 'professional/:mode', component: ProfessionalAddComponent, canActivate: [authGuard] },
  { path: 'professional/:mode/:id', component: ProfessionalAddComponent, canActivate: [authGuard] },
  { path: 'client', component: ClientComponent, canActivate: [authGuard] },
  { path: 'client/:mode', component: ClientCrudComponent, canActivate: [authGuard] },
  { path: 'client/:mode/:id', component: ClientCrudComponent, canActivate: [authGuard] },
  { path: 'employee', component: EmployeeComponent, canActivate: [adminGuard] },
  { path: 'employee/:mode', component: EmployeeCrudComponent , canActivate: [adminGuard]},
  { path: 'employee/:mode/:id', component: EmployeeCrudComponent, canActivate: [adminGuard] },
  { path: 'registry', component: RegistryComponent, canActivate: [authGuard] },
  { path: 'registry/:mode', component: RegistryCrudComponent, canActivate: [authGuard] },
  { path: 'registry/:mode/:id', component: RegistryCrudComponent, canActivate: [authGuard] },
  { path: 'official', component: OfficialComponent, canActivate: [authGuard] },
  { path: 'official/:mode', component: OfficialCrudComponent, canActivate: [authGuard] },
  { path: 'official/:mode/:id', component: OfficialCrudComponent, canActivate: [authGuard] },
  { path: 'log', component: LogsComponent, canActivate: [authGuard] },
  { path: 'payments', component: PaymentComponent, canActivate: [authGuard] },
  { path: 'settings', component: SettingComponent, canActivate: [authGuard] },

  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: '/dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
