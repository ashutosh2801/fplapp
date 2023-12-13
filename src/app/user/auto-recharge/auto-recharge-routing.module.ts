import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AutoRechargePage } from './auto-recharge.page';

const routes: Routes = [
  {
    path: '',
    component: AutoRechargePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AutoRechargePageRoutingModule {}
