import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DashboardPageRoutingModule } from './dashboard-routing.module';
//import { Drivers, Storage } from '@ionic/storage';
//import { IonicStorageModule } from '@ionic/storage-angular';

import { DashboardPage } from './dashboard.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    // IonicStorageModule.forRoot({
    //   name: '__mydb',
    //   driverOrder: [Drivers.IndexedDB, Drivers.LocalStorage]
    // }), 
    DashboardPageRoutingModule
  ],
  declarations: [DashboardPage]
})
export class DashboardPageModule {}
