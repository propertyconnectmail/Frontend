import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { SidebarComponent } from './navigation/sidebar/sidebar.component';
import { DashboardComponent } from './screens/dashboard/dashboard.component';
import { TopbarComponent } from './navigation/topbar/topbar.component';
import { ProfessionalComponent } from './screens/professional/professional.component';
import { ProfessionalAddComponent } from './screens/professional-add/professional-add.component';
import { ToastComponent } from './core/components/toast/toast.component';
import { ClientComponent } from './screens/client/client.component';
import { ClientCrudComponent } from './screens/client-crud/client-crud.component';
import { EmployeeComponent } from './screens/employee/employee.component';
import { EmployeeCrudComponent } from './screens/employee-crud/employee-crud.component';
import { RegistryComponent } from './screens/registry/registry.component';
import { RegistryCrudComponent } from './screens/registry-crud/registry-crud.component';
import { OfficialComponent } from './screens/official/official.component';
import { OfficialCrudComponent } from './screens/official-crud/official-crud.component';
import { LogsComponent } from './screens/logs/logs.component';
import { SettingComponent } from './screens/setting/setting.component';
import { PaymentComponent } from './screens/payment/payment.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SidebarComponent,
    DashboardComponent,
    TopbarComponent,
    ProfessionalComponent,
    ProfessionalAddComponent,
    ToastComponent,
    ClientComponent,
    ClientCrudComponent,
    EmployeeComponent,
    EmployeeCrudComponent,
    RegistryComponent,
    RegistryCrudComponent,
    OfficialComponent,
    OfficialCrudComponent,
    LogsComponent,
    SettingComponent,
    PaymentComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatTooltipModule,
    DragDropModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
