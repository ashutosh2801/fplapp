import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { AppHttpService } from 'src/app/services/app-http.service';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-topup',
  templateUrl: './topup.page.html',
  styleUrls: ['./topup.page.scss'],
})
export class TopupPage implements OnInit {

  logo: string = environment.logo;
  user_id = '';
  response: any = {};
  loading: any;
  registerData : FormGroup = this.fb.group([]);
  registerCredentials : any;
  responseData : any;
  card_number = '**** **** **** ****';
  topup: any = [
    {'amount': 10},
    {'amount': 20},
    {'amount': 30},
    {'amount': 50},
    {'amount': 100},
    {'amount': 200},
  ]

  constructor(
    private fb: FormBuilder,
    private apphttp: AppHttpService, 
    private storage: Storage, 
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private router: Router,
    private auth: AuthService
  ) {
    this.storage.create();
    this.storage.get('user_id').then((userid)=>{
      this.user_id = userid;
      if(this.user_id) {
        this.presentLoading();
        this.apphttp.get('topup/'+this.user_id).subscribe({
          next: (result) => {

            if(result.status==='2') {
              this.presentAlert("Account Terminated", result.error_msg);
              this.storage.clear();
              this.auth.setUserInfo(null);
              this.user_id = null;
              this.response = null;
              this.router.navigate(['/login']);
            }
            
            this.response = result;
            let results : any = result;
            this.card_number = results.card_number;
            console.log(this.response);
            this.loadingCtrl.dismiss('');  
          }, error: (err) => {
            console.log(err);
          }
        });
      }
    });
   }

   formErrors = {
    //'transaction_type':'',
    'topup_amount': ''
  };
  
  validationMessages = {
    'topup_amount': {
      'required': 'Please select topup amount.'
    }
  };

  ngOnInit() {
    this.registerData = this.fb.group({
      //'transaction_type': ['CCard', Validators.required],
      'topup_amount': ['20', Validators.required]
    });

    this.registerData.valueChanges.subscribe((data)=>{
      this.logValidationErrors(this.registerData);
    })
  }

  logValidationErrors(group: FormGroup = this.registerData): void {
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);
      if (abstractControl instanceof FormGroup) {
        this.logValidationErrors(abstractControl);
      } else {
        this.formErrors[key] = '';
        if (abstractControl && !abstractControl.valid && (abstractControl.touched || abstractControl.dirty)) {
          const messages = this.validationMessages[key];
          for (const errorKey in abstractControl.errors) {
            if (errorKey) {
              this.formErrors[key] += messages[errorKey] + ' ';
            }
          }
        }
      }
    });
  }  

  do_topup(registerCredentials) {
    
    this.presentLoading();

    this.apphttp.post('topup/'+this.user_id, registerCredentials).subscribe({ 
      next: (result) => {
        console.log(result);
        this.responseData = result;
        
        this.loadingCtrl.dismiss('');

        if(this.responseData.error_msg)
        this.presentAlert('Error', this.responseData.error_msg);

        if(this.responseData.success_msg)
        this.presentAlert('Success', this.responseData.success_msg);      
        
      }, error: (err) => {
        console.log(err);
      }
    });
  }

  async presentLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Please wait...',
      //duration: 2000,
      spinner: 'bubbles'
    });
    await loading.present();
  }

  async presentAlert(title: string, text: string) {
    const alert = await this.alertCtrl.create({
      header: title,
      //subHeader: 'Subtitle',
      message: text,
      buttons: [
        {
          text: 'OK',
          handler: (data) => {
            if (title=='Success') {
              this.router.navigate(['/user/dashboard']);
            }
          }
        }
      ]
    });
  
    await alert.present();
  }

  add_update() {
    this.router.navigate(['/user/credit-card']);
  }

}
