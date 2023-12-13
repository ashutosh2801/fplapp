import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ContactUsPageRoutingModule } from './contact-us-routing.module';

import { ContactUsPage } from './contact-us.page';
import { MaskitoModule } from '@maskito/angular';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    MaskitoModule,
    ContactUsPageRoutingModule
  ],
  declarations: [ContactUsPage]
})
export class ContactUsPageModule {}
