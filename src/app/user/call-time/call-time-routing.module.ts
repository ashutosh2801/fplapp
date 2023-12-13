import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CallTimePage } from './call-time.page';

const routes: Routes = [
  {
    path: '',
    component: CallTimePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CallTimePageRoutingModule {}
