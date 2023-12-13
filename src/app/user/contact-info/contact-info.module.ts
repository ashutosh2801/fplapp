import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ContactInfoPageRoutingModule } from './contact-info-routing.module';

import { ContactInfoPage } from './contact-info.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ContactInfoPageRoutingModule
  ],
  declarations: [ContactInfoPage]
})
export class ContactInfoPageModule {}
