import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
//import { Router } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { Storage } from '@ionic/storage-angular';
import { Router } from '@angular/router';
import { AuthService } from  '../services/auth.service';
//import { StorageService } from  '../services/storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  registerData: FormGroup = this.fb.group([]);
  logo: string = environment.logo;
  responseData: any = {}; 

  constructor(
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private auth: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private storage: Storage,
  ) {
      
  }

  formErrors: any = {
    'account_id': '',
    'password': ''
  };
  
  validationMessages: any = {
    'account_id': {
      'required': 'FedPhoneLine Number must be 11 digits (Ex. 16134173333)',
      'minlength': 'FedPhoneLine Number must be 11 digits (Ex. 16134173333)',
      'maxlength': 'FedPhoneLine Number must be 11 digits (Ex. 16134173333)',
    },
    'password': {
      'required': 'Password is required.',
      'minlength': 'Password must be greater than 6 characters.',
      'maxlength': 'Password must be less than 16 characters.',
    }
  };

  // async ionViewWillEnter() {
  //   await this.storage.create();
  //   console.log( 'Press Set, Then Press Get' );
  // }

  ngOnInit() {

    this.storage.create();

    this.storage.get('user_id').then(val=>{
      console.log( `Login - ${val}` );
      if(val!==null)
      this.router.navigate(['/user/dashboard']);
    });

    this.registerData = this.fb.group({
      'account_id': ['', Validators.compose([Validators.required, Validators.minLength(11), Validators.maxLength(11)])],
      'password':['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(16)])]
    });

    this.registerData.valueChanges.subscribe((data)=>{
      this.logValidationErrors(this.registerData);
    })
  }

  fbLogin() {
    
  }

  login(formData: any) {

    try{
      console.log(formData);
      this.showLoading();

      this.auth.login(formData, 'login').subscribe((data) => {
        console.log(data.status);
        this.loadingCtrl.dismiss('login');
        
        if(data.status=='success') {

          // this.auth.setUser({
          //   account_id : data.account_id,
          //   user_id: data.user_id
          // });
          this.auth.setUserInfo(data.user_id);

          this.storage.set('user_id', data.user_id);
          this.storage.set('account_id', data.account_id);
          this.router.navigate(['/user/dashboard']);

        } else {
          if(data.User_account_id)
            this.presentAlert('Error', data.User_account_id)
          else if(data.User_password)
            this.presentAlert('Error', data.User_password)
          else if(data.msg)
            this.presentAlert('Error', data.msg)
        }
      });
    }catch(err){
      console.log(err);
    }
  }

  async showLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Please wait...',
      duration: 3000,
      id: 'login'
    });

    loading.present();
  }

  async presentAlert(title:string, text:string) {
    const alert = await this.alertCtrl.create({
      header: title,
      subHeader: text,
      // message: 'This is an alert!',
      buttons: ['OK'],
    });

    await alert.present();
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

}
