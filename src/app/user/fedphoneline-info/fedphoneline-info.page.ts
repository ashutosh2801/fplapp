import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Storage } from '@ionic/storage-angular';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-fedphoneline-info',
  templateUrl: './fedphoneline-info.page.html',
  styleUrls: ['./fedphoneline-info.page.scss'],
})
export class FedphonelineInfoPage implements OnInit {

  logo: string = environment.logo;

  user_id = '';
  loading: any;
  registerData : FormGroup;
  model = {
    'account_id': '',
    'call_type': '',
    'created': '',
  };

  constructor(
    private auth: AuthService, 
    private storage: Storage, 
  ) {
    this.storage.create();
    this.storage.get('user_id').then((userid)=>{
      this.user_id = userid;
      if(this.user_id) {
        //this.presentLoading('');
        console.log(this.user_id);
          
        this.auth.getData('profile/'+this.user_id).subscribe((result) => {
            console.log(result);
            let response : any = result;
            this.model = response.model;
            //this.detail = response.detail;
            //console.log(this.response);          
            //loadingCtrl.dismiss();  
          }, (err) => {
            console.log(err);
          });
        }
      });
  } 

  ngOnInit() {
  }

}
