import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TerminatePageRoutingModule } from './terminate-routing.module';

import { TerminatePage } from './terminate.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TerminatePageRoutingModule
  ],
  declarations: [TerminatePage]
})
export class TerminatePageModule {}
