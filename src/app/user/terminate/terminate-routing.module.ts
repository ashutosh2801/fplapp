import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TerminatePage } from './terminate.page';

const routes: Routes = [
  {
    path: '',
    component: TerminatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TerminatePageRoutingModule {}
