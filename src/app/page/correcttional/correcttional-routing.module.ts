import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CorrecttionalPage } from './correcttional.page';

const routes: Routes = [
  {
    path: '',
    component: CorrecttionalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CorrecttionalPageRoutingModule {}
