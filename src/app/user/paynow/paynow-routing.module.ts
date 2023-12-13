import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PaynowPage } from './paynow.page';

const routes: Routes = [
  {
    path: '',
    component: PaynowPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaynowPageRoutingModule {}
