import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CorrecttionalPageRoutingModule } from './correcttional-routing.module';

import { CorrecttionalPage } from './correcttional.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    CorrecttionalPageRoutingModule
  ],
  declarations: [CorrecttionalPage]
})
export class CorrecttionalPageModule {}
