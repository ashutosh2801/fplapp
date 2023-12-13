import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { JailNewsPageRoutingModule } from './jail-news-routing.module';

import { JailNewsPage } from './jail-news.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    JailNewsPageRoutingModule
  ],
  declarations: [JailNewsPage]
})
export class JailNewsPageModule {}
