import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { AppHttpService } from 'src/app/services/app-http.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
})
export class ChangePasswordPage implements OnInit {

  logo: string = environment.logo;
  user_id = '';
  response = {};
  loading: any;
  month: number;
  package: number;
  tax: number;
  price:number;
  amount:number;
  my_balance: number = 0;
  registerData : FormGroup = this.fb.group([]);
  registerCredentials : any;
  responseData : any;

  constructor(private fb: FormBuilder, 
    private apphttp: AppHttpService, 
    private router: Router,
    private storage: Storage, 
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController) {
      
      this.storage.create();
      this.storage.get('user_id').then((userid)=>{
        this.user_id = userid;
        if(this.user_id) {
          this.presentLoading();
          console.log(this.user_id);
        }
        else {
          this.presentAlert('Error', 'The requested page does not exist.');
        }
      })
    }

    formErrors = {
      'password': '',
      'confirm_password': ''
    };
    
    validationMessages = {
      'password': {
        'required': 'Password is required',
        'minlength': 'Password must be greater than 6 characters.',
        'maxlength': 'Password should be less than 16 characters.',
      },
      'confirm_password': {
        'required': 'Confirm password is required',
        'minlength': 'Confirm password must be greater than 6 characters.',
        'maxlength': 'Confirm password should be less than 16 characters.',
        'equalTo': 'Your confirm password must be same as Password.'
      }
    };
  
    ngOnInit() {
      this.registerData = this.fb.group({
        'password': ['', Validators.compose([Validators.required,  Validators.minLength(6), Validators.maxLength(16)] )],
        'confirm_password':['', Validators.compose([Validators.required,  Validators.minLength(6), Validators.maxLength(16), this.equalto('password')] )],
      });
  
      this.registerData.valueChanges.subscribe((data)=>{
        this.logValidationErrors(this.registerData);
      })
    }
  
    equalto(field_name): ValidatorFn {
      return (control: AbstractControl): { [key: string]: any } => {
          let input = control.value;
          let isValid = control.root.value[field_name] == input;
          if (!isValid)
              return {'equalTo': {isValid}};
          else
              return null;
      };
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
        message: 'Plase wait...',
        duration: 2000,
        spinner: 'bubbles',
        id:'loading'
      });
      await loading.present();
    }

    async presentAlert(header: string, message: string) {
      const alert = await this.alertCtrl.create({
        header: header,
        //subHeader: 'Subtitle',
        message: message,
        buttons: ['OK']
      });
      await alert.present();
    }
  
    do_change_password(registerCredentials) {
      console.log(registerCredentials);
      
      this.presentLoading();

      this.apphttp.post('change_password/'+this.user_id, registerCredentials).subscribe({
        next: result => {
          console.log(result);
        
          this.responseData = result;
          
          console.log(this.responseData);
    
          this.loadingCtrl.dismiss('loading');
    
          if(this.responseData.error_msg)
          this.presentAlert('Error', this.responseData.error_msg);
    
          if(this.responseData.success_msg) {
            this.presentAlert('Success', this.responseData.success_msg);
            this.router.navigate(['/']);
          }
        },
        error: err => console.log(err)
      });
    }
}
