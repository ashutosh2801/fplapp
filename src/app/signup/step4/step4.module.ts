import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Step4PageRoutingModule } from './step4-routing.module';

import { Step4Page } from './step4.page';
import { MaskitoModule } from '@maskito/angular';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    MaskitoModule,
    Step4PageRoutingModule
  ],
  declarations: [Step4Page]
})
export class Step4PageModule {}
