import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AutoRechargePageRoutingModule } from './auto-recharge-routing.module';

import { AutoRechargePage } from './auto-recharge.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    AutoRechargePageRoutingModule
  ],
  declarations: [AutoRechargePage]
})
export class AutoRechargePageModule {}
