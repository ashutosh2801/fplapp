import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController, NavController  } from '@ionic/angular';
import { AppHttpService } from 'src/app/services/app-http.service';
import { Router } from '@angular/router';
import { MaskitoOptions, MaskitoElementPredicateAsync } from '@maskito/core';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.page.html',
  styleUrls: ['./contact-us.page.scss'],
})
export class ContactUsPage implements OnInit {

  //component = Step1Page;
  logo: string = environment.logo;
  registerData: FormGroup;
  createSuccess = false;
  responseData : any;
  registerCredentials : any;
  userid = '0';
  telephone: string;
  mismatchedPhone = false;
  telephone3='';
  loading: any;
  readonly phoneMask: MaskitoOptions = {
    mask: ['+', '1', ' ', '(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/],
  };
  readonly maskPredicate: MaskitoElementPredicateAsync = async (el) => (el as HTMLIonInputElement).getInputElement();
  
  formErrors = {
    'type': '',
    'name': '',
    'email':'',
    'phone':'',
    'message':''
  };
  
  validationMessages = {
    'type': {
      'required': 'Type is required.'
    },
    'name': {
      'required': 'Name is required.'
    },
    'email': {
      'required': 'Email is required.',
      'email': 'Email address must be valid.',
    },
    'phone': {
      'required': 'Phone is required.',
      'minlength': 'Phone Number must be 10 digits (Ex. +1 (416) 222-3333)',
      'maxlength': 'Phone Number should be maximum 10 digits (Ex. +1 (416) 222-3333)'
    },
    'message': {
      'required': 'Message is required.',
      'minlength': 'Message must be enter minmum 10 charecters.',
    },
  };

  constructor( 
    private fb: FormBuilder, 
    private apphttp: AppHttpService, 
    private alertCtrl: AlertController, 
    private loadingCtrl: LoadingController,
    private router: Router) {
  }

  ngOnInit() {
    this.registerData = this.fb.group({
      'type': ['In Need of Support', Validators.required],
      'name': ['', [Validators.required]],
      'email': ['', [Validators.required, Validators.email]],
      'phone': ['', [Validators.required, Validators.minLength(17), Validators.maxLength(17)]],
      'message': ['', [Validators.required, Validators.min(10)]]
    });

    this.registerData.valueChanges.subscribe((data)=>{
      this.logValidationErrors(this.registerData);
    })
  }

  async presentLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Please wait...',
      duration: 2000,
      spinner: 'bubbles'
    });
    await loading.present();
  }

  public do_contact(registerCredentials) {
    //console.log(registerCredentials);
    //if(this.userid!=null) {  
      this.presentLoading();
      this.apphttp.post('contact', registerCredentials).subscribe({
        next: (result) => {
          this.responseData = result;
          this.loadingCtrl.dismiss('');
          //console.log(result);
          if(this.responseData.status=='success') {
            this.showPopup("Success", this.responseData.msg);
          }
          else {
            if(this.responseData.Contact_type) {
              this.showPopup("Error", this.responseData.Contact_type);  
            }
            else if(this.responseData.Contact_name) {
              this.showPopup("Error", this.responseData.Contact_name);  
            }
            else if(this.responseData.Contact_phone) {
              this.showPopup("Error", this.responseData.Contact_phone);  
            }
            else if(this.responseData.Contact_email) {
              this.showPopup("Error", this.responseData.Contact_email);  
            }
            else if(this.responseData.Contact_message) {
              this.showPopup("Error", this.responseData.Contact_message);  
            }
            else {
              for (const errorMsg in this.responseData) {
                if (errorMsg) {
                  this.showPopup("Error", errorMsg); break;
                }
              }
            }     
          }
        }, error: (err) => {
          // Error log
        }
      });
    // }
    // else {
    //   this.showPopup("Error", 'Invalid code!');  
    // }
  }

  async showPopup(title: string, text: string) {
    const alert = await this.alertCtrl.create({
      header: title,
      //subHeader: 'Subtitle',
      message: text,
      buttons: [
        {
          text: 'OK',
          handler: data => {
            if (title=='Success') {
              this.router.navigate(['/']);
            }
          }
        }
      ]
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
              this.formErrors[key] = messages[errorKey];
            }
          }
        }
      }
    });
  }

}
