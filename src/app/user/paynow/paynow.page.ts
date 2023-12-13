import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { AppHttpService } from 'src/app/services/app-http.service';
import { environment } from 'src/environments/environment';
import { Storage } from '@ionic/storage-angular'
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-paynow',
  templateUrl: './paynow.page.html',
  styleUrls: ['./paynow.page.scss'],
})
export class PaynowPage implements OnInit {

  logo: string = environment.logo;
  user_id = '';
  response:any = {'next_month':''};
  loading: any;
  month: number;
  package: number;
  tax: number;

  price:number;
  amount:number;
  my_balance: number = 0;
  my_balance2: number = 0;
  card_number: 'xxxx xxxx xxxx xxxx';
  registerData : FormGroup = this.fb.group([]);
  registerCredentials : any;
  responseData : any;
  isEnabled: boolean;
  formErrors = {
    'num': '',
    'transaction_type': ''
  };
  
  validationMessages = {
    'num': {
      'required': 'Please select amount owing month'
    },
    'transaction_type': {
      'required': 'Please select payment method.',
    }
  };

  constructor(
    private fb: FormBuilder,
    private apphttp: AppHttpService, 
    private storage: Storage, 
    private loadingCtrl: LoadingController,
    private router: Router,
    private alertCtrl: AlertController,
    private auth: AuthService
  ) { 
      this.storage.create();
      this.storage.get('user_id').then((val)=>{
        this.user_id = val;
        if(this.user_id) 
        {
          this.presentLoading();
          this.apphttp.get('paynow/'+this.user_id).subscribe({
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
              //console.log(this.response);
              let results: any = result;
              this.package = results.price;
              this.tax = results.tax;
              this.my_balance = results.my_balance;
              this.my_balance2 = results.my_balance;
              this.card_number = results.card_number; 
              this.isEnabled = results.my_balance>0 ? false : true;
              this.loadingCtrl.dismiss('loading');  
            },
            error: (err) => {
              console.log(err);
            }
          });
        }
      })
  }

  ngOnInit() {
    this.registerData = this.fb.group({
      'num': ['', Validators.required],
      'transaction_type':['CCard', Validators.required]
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
      buttons: [
        {
          text: 'OK',
          handler: data => {
            if (title=='Success') {
              this.router.navigate(['/user/dashboard']);
            }
          }
        }
      ]
    });
  
    await alert.present();
  }

  do_payment(registerCredentials: any) {
    console.log(registerCredentials);
    this.presentLoading();
    this.apphttp.post('paynow/'+this.user_id, registerCredentials).subscribe({
      next: (result) => {
        this.responseData = result;
        
        console.log(this.responseData);

        this.loadingCtrl.dismiss('');

        if(this.responseData.error_msg)
        this.presentAlert('Error', this.responseData.error_msg);

        if(this.responseData.success_msg)
        this.presentAlert('Success', this.responseData.success_msg);
      
      
    }, 
    error: (err) => {
      console.log(err);
      this.loadingCtrl.dismiss('');
    }
  });
  }

  

  add_update() {
    this.router.navigate(['/user/credit-card']);
  }

  change_month(e: any) {
    
    const month = (parseInt(e.target.value)-1);
  
    let price 	= (this.package * month);
    let tax 	= (price * this.tax)/100; 
    let amount 	= price + tax;

    this.my_balance2 = Number(amount) + Number(this.my_balance);
  }

}
