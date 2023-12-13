import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PricingPageRoutingModule } from './pricing-routing.module';

import { PricingPage } from './pricing.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PricingPageRoutingModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [PricingPage]
})
export class PricingPageModule {}
