import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { JailNewsPage } from './jail-news.page';

const routes: Routes = [
  {
    path: '',
    component: JailNewsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JailNewsPageRoutingModule {}
