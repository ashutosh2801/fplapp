import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MaskitoOptions, MaskitoElementPredicateAsync } from '@maskito/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { AppHttpService } from 'src/app/services/app-http.service';

@Component({
  selector: 'app-step1',
  templateUrl: './step1.page.html',
  styleUrls: ['./step1.page.scss'],
})
export class Step1Page implements OnInit {

  logo: string = environment.logo;
  registerData: FormGroup = this.fb.group({});
  telephone2: number = 0;
  responseData: any;
  email2: string = '';
  phone_reminder: number = 1;
  email_reminder: number = 1;
  formErrors: any = {
    'username': '',
    'ref_code':'',
    'first_name': '',
    'last_name': '',
    'email': '',
    'confirm_email': '',
    'telephone':'',
    'province':'',
    'reminder': '',
    'telephone2': '',
    'email2': ''
  };
  
  validationMessages: any = {
    'username': {
      'required': 'Username is required.',
      'minlength': 'Username must be greater than 6 characters.',
      'maxlength': 'Username must be less than 16 characters.',
      'pattern': 'Your username must contain only numbers and letters'
    },
    'first_name': {
      'required': 'Firstname is required.',
      'minlength': 'Firstname must be greater than 2 characters.',
      'pattern': 'Invalid firstname'
    },
    'last_name': {
      'required': 'Lastname is required.',
      'minlength': 'Firstname must be greater than 2 characters.',
      'pattern': 'Invalid lastname'
   },
    'email': {
      'required': 'Email is required.',
      'email': 'Your email address must be valid.',
    },
    'confirm_email': {
      'required': 'Confirm email is required.',
      'email': 'Your confirm email address must be valid.',
      'equalTo': 'Your email must match'
    },
    'province': { 
      'required': 'Province is required.',
    },
    'telephone': { 
      'required': 'Account Holder Phone Number is required.',
      'minlength': 'Account Holder Phone Number must be 10 digits (Ex. +1 (416) 222-3333).',
      'maxlength': 'Account Holder Phone Number should be maximum 10 numbers (Ex. +1 (416) 222-3333).'
    },
    'reminder': { 
      'required': 'Reminder Type is required.',
    },
    'telephone2': { 
      'required': 'Phone Number to Text Me is required',
      'minlength': 'Phone Number must be 10 digits (Ex. +1 (416) 222-3333)',
      'maxlength': 'Phone Number should be maximum 10 digits (Ex. +1 (416) 222-3333)'
    },
    'email2': { 
      'required': 'Reminder Email Address is required.',
      'email': 'Reminder email address must be valid.',
    },
  };

  constructor(
    private fb: FormBuilder,
    private loadingCtrl: LoadingController,
    private alertController: AlertController,
    private apphttp: AppHttpService,
    private router: Router,
    private storage: Storage,

  ) {   }

  ngOnInit() {

    this.storage.create();

    this.registerData = this.fb.group({
      'username':['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(16), Validators.pattern('^[a-zA-Z0-9]+$')])],
      'ref_code': [''],
      'first_name':['', Validators.compose([Validators.required, Validators.minLength(2), Validators.pattern('^[a-zA-Z- ]+$')])],
      'last_name':['', Validators.compose([Validators.required, Validators.minLength(2), Validators.pattern('^[a-zA-Z- ]+$')])],
      'email':['', Validators.compose([Validators.required, Validators.email])],
      'confirm_email': ['', Validators.compose([Validators.required, Validators.email, this.equalto('email')])],
      'telephone':['', Validators.compose([Validators.required, Validators.minLength(17), Validators.maxLength(17)])],
      'province':['', Validators.compose([Validators.required])],
      'reminder':['1', Validators.required],
      'telephone2':['', [Validators.required, Validators.minLength(17), Validators.maxLength(17)]],
      'email2':['', [Validators.required]],
    });

    this.registerData.valueChanges.subscribe((data)=>{
      this.logValidationErrors(this.registerData);
    })
  }

  equalto(field_name: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
        let input = control.value;
        let isValid = control.root.value[field_name] == input;
        if (!isValid)
          return { 'equalTo' : {isValid} };
        else
          return {};
    };
  } 

  async showLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Please wait...',
      duration: 3000,
    });

    await loading.present();
  }

  async showPopup(title: string, text: string) {
    const alert = await this.alertController.create({
      header: title,
      subHeader: '',
      message: text,
      buttons: ['OK']
    });
  
    await alert.present();
  }

  register(formData: any) {
    //if (this.registerData.valid) {
      console.log(formData);
      this.showLoading();

      this.apphttp.post('register1', formData).subscribe((result) => {
        this.responseData = result;
      
        console.log(this.responseData);

        this.loadingCtrl.dismiss();
        if(this.responseData.status=='success') {
        
          console.log(this.responseData);
          //this.showPopup("Success", this.responseData.msg);
          this.storage.set('userid', this.responseData.userid);
          this.storage.set('telephone', this.responseData.telephone);
          
          this.storage.get('userid').then(() => {
            this.router.navigate(['signup/step2']);
          });
        }
        else {

          if(this.responseData.msg) {
            this.showPopup("Error", this.responseData.msg);  
          }
          else {
            for (const errorMsg in this.responseData) {
              if (errorMsg=='Signup_username') {
                this.showPopup("Error", 'Invalid Username!'); break;
              }
              else if (errorMsg=='Signup_email') {
                this.showPopup("Error", 'Invalid Email Address!'); break;
              }
              else if (errorMsg=='Signup_zipcode') {
                this.showPopup("Error", 'Invalid Zip Code!'); break;
              }
              else if (errorMsg=='Signup_first_name') {
                this.showPopup("Error", 'Invalid First Name!'); break;
              }
              else if (errorMsg=='Signup_last_name') {
                this.showPopup("Error", 'Invalid Last Name!'); break;
              }
              else if (errorMsg=='Signup_telephone') {
                this.showPopup("Error", 'Invalid Phone Number!'); break;
              }
              else {
                this.showPopup("Error", `Invalid ${errorMsg}!`); break;
              }
            }
          }    
        }
      });

    //}
  }

  telephone_func(val: any) { 
    this.telephone2 = val.target!.value; 
    this.registerData.get('telephone2').setValue( this.telephone2 );
  }

  email_func(val: any) { 
    this.email2 = val.target!.value; 
    this.registerData.get('email2').setValue( this.email2 );
  }       

  billing_reminder_func(e: any) { 
    const val = e.target.value;
    if(val==='1') {
      this.phone_reminder = 1; this.email_reminder = 1;
    }
    else if(val==='2') {
      this.phone_reminder = 0; this.email_reminder = 1;
    } 
    else {
      this.phone_reminder = 0; this.email_reminder = 0;
    }
  }

  readonly phoneMask: MaskitoOptions = {
    mask: ['+', '1', ' ', '(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/],
  };
  readonly maskPredicate: MaskitoElementPredicateAsync = async (el) => (el as HTMLIonInputElement).getInputElement();

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
