import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UpgradePageRoutingModule } from './upgrade-routing.module';

import { UpgradePage } from './upgrade.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    UpgradePageRoutingModule
  ],
  declarations: [UpgradePage]
})
export class UpgradePageModule {}
