import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { AppHttpService } from 'src/app/services/app-http.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-auto-recharge',
  templateUrl: './auto-recharge.page.html',
  styleUrls: ['./auto-recharge.page.scss'],
})
export class AutoRechargePage implements OnInit {

  logo: string = environment.logo;
  user_id = '';
  response: any = {};
  loading: any;
  registerData : FormGroup;
  registerCredentials : any;
  responseData: any;
  //balance_term = false;
  //topup_term = false;
  isTopupAmount = 0;
  isBalanceChecked = false;
  isTopupChecked = false;

  constructor(
    private fb: FormBuilder, 
    private apphttp: AppHttpService,
    private router: Router, 
    private storage: Storage, 
    private alertCtrl: AlertController, 
    private loadingCtrl: LoadingController
  ) {
    this.storage.create();
    this.storage.get('user_id').then((userid)=>{
      this.user_id = userid;
      if(this.user_id) {
        this.presentLoading();
        
        this.apphttp.get('auto_recharge/'+this.user_id).subscribe({
          next: (result) => {
            this.response = result;
            //console.log(this.response);
            
            let res : any = result;

            if(res.balance_term==1)
            this.registerData.get('balance_term').patchValue(true);

            if(res.topup_term==1)
            this.registerData.get('topup_term').patchValue(true);

            if(res.topup_amount>0)
            this.registerData.get('topup_amount').patchValue(res.topup_amount);

            this.loadingCtrl.dismiss('loading');  
          }, error: (err) => {
            console.log(err);
          }
        });
      }
    });
   }

   ngOnInit() {
    console.log('balance_term');
    this.registerData = this.fb.group({
      'balance_term': [false],
      'topup_amount':[0] ,
      'topup_term':[false] 
    });    
  }

  edit_account() {
    this.router.navigate(['/user/contact-info']);
  }

  loadTopup() {
    //console.log(this.registerData.get('topup_amount').value);
    if(this.registerData.get('topup_term').value == false )
    this.registerData.get('topup_amount').patchValue(0);
  }

  do_auto_recharge(registerCredentials: any) {
    
    if(this.registerData.get('topup_term').value == false && this.registerData.get('topup_amount').value > 0)
    {
      this.presentAlert('Error', 'Please check Consent button.'); 
      return false; 
    }
    if(this.registerData.get('topup_term').value == true && this.registerData.get('topup_amount').value == 0)
    {
      this.presentAlert('Error', 'Please select Top Up amount.'); 
      return false; 
    }

    this.presentLoading();

    this.apphttp.post('auto_recharge/'+this.user_id, registerCredentials).subscribe({
      next: (result) => {
        this.responseData = result;
        
        this.loadingCtrl.dismiss('');

        if(this.responseData.error)
        this.presentAlert('Error', this.responseData.error);

        if(this.responseData.success) {
          this.presentAlert('Success', this.responseData.success);      
          this.router.navigate(['/user/dashboard']);
        }     
        
      }, 
      error: (err) => {
        console.log(err);
      }
    });
  }

  async presentLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Please wait...',
      duration: 2000,
      spinner: 'bubbles',
      id: 'loading'
    });
    await loading.present();
  }

  async presentAlert(title: string, text: string) {
    const alert = await this.alertCtrl.create({
      header: title,
      //subHeader: 'Subtitle',
      message: text,
      buttons: ['OK']
    });
    await alert.present();
  }
}
