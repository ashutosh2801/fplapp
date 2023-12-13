import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewNumberPageRoutingModule } from './new-number-routing.module';

import { NewNumberPage } from './new-number.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    NewNumberPageRoutingModule
  ],
  declarations: [NewNumberPage]
})
export class NewNumberPageModule {}
