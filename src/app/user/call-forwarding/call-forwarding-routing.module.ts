import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CallForwardingPage } from './call-forwarding.page';

const routes: Routes = [
  {
    path: '',
    component: CallForwardingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CallForwardingPageRoutingModule {}
