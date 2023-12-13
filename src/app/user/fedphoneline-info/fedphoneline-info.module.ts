import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FedphonelineInfoPageRoutingModule } from './fedphoneline-info-routing.module';

import { FedphonelineInfoPage } from './fedphoneline-info.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FedphonelineInfoPageRoutingModule
  ],
  declarations: [FedphonelineInfoPage]
})
export class FedphonelineInfoPageModule {}
