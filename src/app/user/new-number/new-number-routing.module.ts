import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewNumberPage } from './new-number.page';

const routes: Routes = [
  {
    path: '',
    component: NewNumberPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewNumberPageRoutingModule {}
