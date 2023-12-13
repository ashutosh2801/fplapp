import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreditCardPageRoutingModule } from './credit-card-routing.module';

import { CreditCardPage } from './credit-card.page';
import { MaskitoModule } from '@maskito/angular';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaskitoModule,
    IonicModule,
    CreditCardPageRoutingModule
  ],
  declarations: [CreditCardPage]
})
export class CreditCardPageModule {}
