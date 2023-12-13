import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Step3PageRoutingModule } from './step3-routing.module';

import { Step3Page } from './step3.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Step3PageRoutingModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [Step3Page]
})
export class Step3PageModule {}
