import { Component, OnInit } from '@angular/core';
import { StorageService } from '../services/storage.service';


@Component({
  selector: 'app-test',
  templateUrl: './test.page.html',
  styleUrls: ['./test.page.scss'],
})
export class TestPage implements OnInit {

  constructor(private storage: StorageService) {
  }

  ngOnInit() {
    console.log( this.getValue() );
  }

  async setValue() {
    await this.storage.set('country', 'India');
  }

  async getValue() {
    const value = await this.storage.get('user_id');
    console.log(value);
  }

  async removeValue() {
    await this.storage.remove('country');
  }

  async clearValue() {
    await this.storage.clear();
  }

}
