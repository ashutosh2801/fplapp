import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BillingCalculatorPageRoutingModule } from './billing-calculator-routing.module';

import { BillingCalculatorPage } from './billing-calculator.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    BillingCalculatorPageRoutingModule
  ],
  declarations: [BillingCalculatorPage]
})
export class BillingCalculatorPageModule {}
