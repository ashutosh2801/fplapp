import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CallForwardingPageRoutingModule } from './call-forwarding-routing.module';

import { CallForwardingPage } from './call-forwarding.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    CallForwardingPageRoutingModule
  ],
  declarations: [CallForwardingPage]
})
export class CallForwardingPageModule {}
