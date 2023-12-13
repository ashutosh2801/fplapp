import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LoginPageRoutingModule } from './login-routing.module';
import { LoginPage } from './login.page';
import { Drivers, Storage } from '@ionic/storage';
//import { IonicStorageModule } from '@ionic/storage-angular';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    LoginPageRoutingModule,
    // IonicStorageModule.forRoot({
    //   name: '__mydb',
    //   driverOrder: [Drivers.IndexedDB, Drivers.LocalStorage]
    // }),
  ],
  declarations: [LoginPage]
})
export class LoginPageModule {}
