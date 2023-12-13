import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CorrectionalDetailPageRoutingModule } from './correctional-detail-routing.module';

import { CorrectionalDetailPage } from './correctional-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CorrectionalDetailPageRoutingModule
  ],
  declarations: [CorrectionalDetailPage]
})
export class CorrectionalDetailPageModule {}
