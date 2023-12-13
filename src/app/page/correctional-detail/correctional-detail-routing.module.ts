import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CorrectionalDetailPage } from './correctional-detail.page';

const routes: Routes = [
  {
    path: '',
    component: CorrectionalDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CorrectionalDetailPageRoutingModule {}
