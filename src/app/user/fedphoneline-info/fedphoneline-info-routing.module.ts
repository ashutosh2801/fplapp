import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FedphonelineInfoPage } from './fedphoneline-info.page';

const routes: Routes = [
  {
    path: '',
    component: FedphonelineInfoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FedphonelineInfoPageRoutingModule {}
