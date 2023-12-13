import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { AppHttpService } from 'src/app/services/app-http.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-call-time',
  templateUrl: './call-time.page.html',
  styleUrls: ['./call-time.page.scss'],
})
export class CallTimePage implements OnInit {

  logo: string = environment.logo;
  user_id = '';
  tablestyle = 'bootstrap';
  data:any = [
    {
        "Account_ID": "1",
        "Connected_time": "3Mins",
        "Caller": "9876543210",
        "Called": "9876543210",
        "Ringtime": "5mins",
        "Duration": "10Mins",
        "Reason": "ABCd",
    },
    {
      "Account_ID": "2",
      "Connected_time": "3Mins",
      "Caller": "9876543210",
      "Called": "9876543210",
      "Ringtime": "5mins",
      "Duration": "10Mins",
      "Reason": "ABCd",
  },
  {
    "Account_ID": "3",
    "Connected_time": "3Mins",
    "Caller": "9876543210",
    "Called": "9876543210",
    "Ringtime": "5mins",
    "Duration": "10Mins",
    "Reason": "ABCd",
},
{
  "Account_ID": "4",
  "Connected_time": "3Mins",
  "Caller": "9876543210",
  "Called": "9876543210",
  "Ringtime": "5mins",
  "Duration": "10Mins",
  "Reason": "ABCd",
},
  ];

  constructor(
    private apphttp: AppHttpService, 
    private storage: Storage, 
    private loadingCtrl: LoadingController
  ) { 
    this.storage.create();
    this.storage.get('user_id').then((userid)=>{
      this.user_id = userid;
      if(this.user_id) {

        this.presentLoading();

        //this.user_id = val;
        this.apphttp.get('call_times/'+this.user_id).subscribe({
          next: (result) => {
            //console.log(result);
            //let response : any = result;
            //this.data = response.cdrdata;     
            loadingCtrl.dismiss();  
          }, error: (err) => {
            console.log(err);
          }
        });
      }
    });
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
