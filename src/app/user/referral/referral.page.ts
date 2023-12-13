import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { AppHttpService } from 'src/app/services/app-http.service';
import { environment } from 'src/environments/environment';
import { Storage } from '@ionic/storage-angular'
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-referral',
  templateUrl: './referral.page.html',
  styleUrls: ['./referral.page.scss'],
})
export class ReferralPage implements OnInit {

  logo: string = environment.logo;
  user_id = '';
  tablestyle = 'bootstrap';
  data: any;
  columns: any;
  expanded = {};
  timeout: any;
  selected = [];
  referral:string;
  ColumnMode = ColumnMode;
  SelectionType = SelectionType;

  constructor(
    private auth: AppHttpService, 
    private storage: Storage, 
    private loadingCtrl: LoadingController
  ) { 

    this.storage.create();
    this.storage.get('user_id').then((val)=> {

      this.user_id = val;
      if(this.user_id) {
        console.log(this.user_id);

        this.presentLoading();

        //this.user_id = val;
        this.auth.get('referral/'+this.user_id).subscribe({
          next: (result) => {
            console.log(result);
            let response : any = result;
            this.referral = response.referral;    
            this.data = response.referrals;     
            this.loadingCtrl.dismiss('loading');  
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

  async presentLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Loading data...',
      duration: 2000,
      spinner: 'bubbles',
      id: 'loading'
    });
    await loading.present();
  }

  ngOnInit() {
  }

}
