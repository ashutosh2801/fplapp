import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BillingCalculatorPage } from './billing-calculator.page';

const routes: Routes = [
  {
    path: '',
    component: BillingCalculatorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BillingCalculatorPageRoutingModule {}
