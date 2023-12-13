import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { AppHttpService } from 'src/app/services/app-http.service';
import { environment } from 'src/environments/environment';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-order',
  templateUrl: './order.page.html',
  styleUrls: ['./order.page.scss'],
})
export class OrderPage implements OnInit {

  public logo: string = environment.logo;
  public user_id = '';
  public data: any;
  public columns: any;
  expanded = {};
  timeout: any;
  selected = [];
  ColumnMode = ColumnMode;
  SelectionType = SelectionType;

  constructor(
    private apphttp: AppHttpService, 
    private storage: Storage, 
    private loadingCtrl: LoadingController,
  ) {
    this.storage.create();
    this.storage.get('user_id').then((userid)=>{
      this.user_id = userid;
      if( this.user_id ) {

        this.presentLoading();

        this.apphttp.get('orders/'+this.user_id).subscribe({
          next: (result) => {
            console.log(result);
            let response : any = result;
            this.data = response.orders;     
            loadingCtrl.dismiss();  
          }, error: (err) => {
            console.log(err);
          }
        });
      }
    });
  }

  onSelect({ selected }) {
    console.log('Select Event', selected, this.selected);

    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }

  onActivate(event) {
    console.log('Activate Event', event);
  }

  onPage(event) {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      console.log('paged!', event);
    }, 100);
  }

  async presentLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Loading data...',
      duration: 2000,
      spinner: 'bubbles'
    });
    await loading.present();
  }

  ngOnInit() {
  }

}
