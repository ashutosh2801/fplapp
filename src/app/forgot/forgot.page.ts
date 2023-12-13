import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { AppHttpService } from '../services/app-http.service';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.page.html',
  styleUrls: ['./forgot.page.scss'],
})
export class ForgotPage implements OnInit {

  logo: string = environment.logo;
  registerData: FormGroup = this.fb.group([]);
  formErrors: any = {
    'account_id': ''
  };
  createSuccess = false;
  registerCredentials : any;
  responseData : any;
  loading : any; 
  
  validationMessages: any = {
    'account_id': {
      'required': 'FedPhoneLine Number must be 11 digits (Ex. 16134173333)',
      'minlength': 'FedPhoneLine Number must be 11 digits (Ex. 16134173333)',
      'maxlength': 'FedPhoneLine Number must be 11 digits (Ex. 16134173333)',
    }
  };

  constructor( 
    private fb: FormBuilder, 
    private auth: AppHttpService,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController) { }

  ngOnInit() {
    this.registerData =  this.fb.group({
      'account_id': ['', Validators.compose([Validators.required, Validators.minLength(11), Validators.maxLength(11)])]
    })
  }

  async showPopup(text) {
    const alert = await this.alertCtrl.create({
      header: 'Success',
      subHeader: 'Change Password Request Received!',
      message: text,
      buttons: ['OK']
    });

    await alert.present();
  }

  async showLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Verify your FedPhoneLine number...',
      duration: 2000,
      spinner: 'bubbles'
    });
    await loading.present();
  }
 
  async presentToast(msg) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2000,
      position: 'bottom',
    });
    toast.present();
  }

  submitForm(registerCredentials) {
    console.log(registerCredentials);
		this.showLoading(); 

    this.auth.post('forgotPassword', registerCredentials).subscribe({
      next: (result) => {
      this.responseData = result;      
      console.log(this.responseData);
			this.loadingCtrl.dismiss('');
      if(this.responseData.status=='success') {			
        console.log(this.responseData);	
        this.showPopup(this.responseData.msg);			
      }
      else {
        if(this.responseData.User_account_id) {
          this.presentToast(this.responseData.User_account_id);
        }
        else {
          this.presentToast(this.responseData.msg);
        }     
      }
      }, 
      error: (err) => {
        console.log(err);
      }
    });
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
