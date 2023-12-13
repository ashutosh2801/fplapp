import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { AppHttpService } from 'src/app/services/app-http.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-contact-info',
  templateUrl: './contact-info.page.html',
  styleUrls: ['./contact-info.page.scss'],
})
export class ContactInfoPage implements OnInit {

  logo: string = environment.logo;
  user_id = '';
  loading: any;
  month: number;
  package: number;
  tax: number;
  price:number;
  amount:number;
  my_balance: number = 0;
  registerData : FormGroup;
  registerCredentials : any;
  responseData : any;
  model = {
    'message': '',
    'email': '',
    'first_name': '',
    'last_name': '',
  };
  detail = {
    'house_number': '',
    'street_suffix': '',
    'street_name': '',
    'unit_apt': '',
    'province': '',
    'city': '',
    'zipcode': '',
    'telephone': '',
    'telephone2': ''
  };

  constructor(
    private fb: FormBuilder,
    private apphttp: AppHttpService, 
    private storage: Storage, 
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController) 
  {

    this.storage.create();
    this.storage.get('user_id').then((userid)=>{
      this.user_id = userid;
      if(this.user_id) {
        this.presentLoading('');
        console.log(this.user_id);
          
        this.apphttp.get('profile/'+this.user_id).subscribe({
          next: result => {
          let response : any = result;
          this.model = response.model;
          this.detail = response.detail;

          this.registerData.get('message').setValue( this.model.message );
          this.registerData.get('email').setValue( this.model.email );
          this.registerData.get('first_name').setValue( this.model.first_name );
          this.registerData.get('last_name').setValue( this.model.last_name );
          this.registerData.get('house_number').setValue( this.detail.house_number );
          this.registerData.get('street_suffix').setValue( this.detail.street_suffix );
          this.registerData.get('street_name').setValue( this.detail.street_name );
          this.registerData.get('unit_apt').setValue( this.detail.unit_apt );
          this.registerData.get('province').setValue( this.detail.province );
          this.registerData.get('city').setValue( this.detail.city );
          this.registerData.get('zipcode').setValue( this.detail.zipcode );
          this.registerData.get('telephone').setValue( this.detail.telephone );
          this.registerData.get('telephone2').setValue( this.detail.telephone2 );
          //this.registerData.get('telephone').setValue( this.detail.telephone );
          //this.registerData.get('telephone').setValue( this.detail.telephone );
          //this.registerData.get('telephone').setValue( this.detail.telephone );

          //console.log(this.detail);

          if(response.model.message==1)
          this.registerData.get('message').patchValue(1);
          else 
          this.registerData.get('message').patchValue(0);

          //this.registerData.patchValue('number').setValue();
          this.registerData.get('street_suffix').setValue(response.detail.street_suffix);
          this.registerData.get('province').setValue(response.detail.province);

          //console.log(this.response);          
          this.loadingCtrl.dismiss('');  
        }, 
        error:  err => {
          console.log(err);
        }
        });
      }
    });
  }

  formErrors = {
    'message': '',
    'email': '',
    'first_name': '',
    'last_name': '',
    'house_number': '',
    'street_suffix': '',
    'street_name': '',
    'unit_apt': '',
    'province': '',
    'city': '',
    'zipcode': '',
    'telephone': '',
    'telephone2': ''
  };
  
  validationMessages = {
    'message': {
      'required': 'Message notification should be checked.'
    },
    'email': {
      'required': 'Email can not be blank.',
    },
    'first_name': {
      'required': 'First name can not be blank.',
    },
    'last_name': {
      'required': 'Last name can not be blank.',
    },
    'house_number': {
      'required': 'House number can not be blank.',
    },
    'street_suffix': {
      'required': 'Street name can not be blank.',
    },
    'street_name': {
      'required': 'Street name can not be blank.',
    },
    'unit_apt': {
      'required': 'Uint apt can not be blank.',
    },
    'province': {
      'required': 'Province can not be blank.',
    },
    'city': {
      'required': 'City can not be blank.',
    },
    'zipcode': {
      'required': 'Zipcode/Postal code can not be blank.',
    },
    'telephone': {
      'required': 'Telephone can not be blank.',
    },
    'telephone2': {
      'required': '"Number to Text Me" can not be blank.',
    }
  };

  suffix: any[] = [
    {"id":"", "name":"None"},    
    {"id":" Ave.", "name":"Avenue"},
    {"id":" Blvd.", "name":"Boulevard"},
    {"id":" Cres.", "name":"Crescent"},
    {"id":" Crt.", "name":"Court"},
    {"id":" Dr." , "name":"Drive"},
    {"id":" Lane.", "name":"Lane"},
    {"id":" Pl.", "name":"Place"},
    {"id":" Pky.", "name":"Parkway"},
    {"id":" Rd.", "name":"Road"},
    {"id":" St.", "name":"Street"},
    {"id":" Terr.", "name":"Terrace"}, 
    {"id":" Way.", "name":"Way"}
  ];

  provinces: any[] = [
    {"id":"", "name":"Province"},    
    {"id":"60","name":"Alberta"},
    {"id":"61","name":"British Columbia"},
    {"id":"62","name":"Manitoba"},
    {"id":"63","name":"New Brunswick"},
    {"id":"66","name":"Nova Scotia"},
    {"id":"68","name":"Ontario"},
    {"id":"70","name":"Québec"},
    {"id":"71","name":"Saskatchewan"}
  ];

  ngOnInit() {
    this.registerData = this.fb.group({
      'message': ['1', Validators.required],
      'email':['', Validators.required],
      'first_name':['', Validators.required],
      'last_name':['', Validators.required],
      'house_number':[''],
      'street_suffix':[''],
      'street_name':[''],
      'unit_apt':[''],
      'province':['', Validators.required],
      'city':['', Validators.required],
      'zipcode':['', Validators.required],
      'telephone':['', Validators.required],
      'telephone2':['', Validators.required]
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

  async presentLoading(message: string) {
    const loading = await this.loadingCtrl.create({
      message: message?message:'Please wait...',
      duration: 3000,
      id: 'loadingID'
    });

    loading.present();
  }

  do_payment(registerCredentials) {
    console.log(registerCredentials);
    
    if(this.registerData.valid == true)
    {
      this.presentLoading('Please wait...');

      this.apphttp.post('profile/'+this.user_id, registerCredentials).subscribe({
        next: (result) => {
          //this.responseData = result;      
          //console.log(this.responseData);
          console.log(result);
          let response : any = result;
          this.model = response.model;
          this.detail = response.detail;
          this.loadingCtrl.dismiss('loadingID');

          if(response.error_msg)
          this.presentAlert('Error', response.error_msg);

          if(response.success_msg)
          this.presentAlert('Success', response.success_msg);
        }, error: (err) => {
          console.log(err);
        }
      });
    }
    else {
      console.log(this.registerData.errors);
    }
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
