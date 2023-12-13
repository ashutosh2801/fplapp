import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { AppHttpService } from 'src/app/services/app-http.service';
import { environment } from 'src/environments/environment';
import { MaskitoOptions, MaskitoElementPredicateAsync } from '@maskito/core';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-credit-card',
  templateUrl: './credit-card.page.html',
  styleUrls: ['./credit-card.page.scss'],
})
export class CreditCardPage implements OnInit {

  logo: string = environment.logo;
  cardImg: string = environment.cardImg;
  user_id = '';
  response: any = {};
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
  card_number: '';
  today: number = new Date().getFullYear();
  months: any[] = [
    {'value':'01','text':'(01) Jan'},
    {'value':'02','text':'(02) Feb'},
    {'value':'03','text':'(03) Mar'},
    {'value':'04','text':'(04) Apr'},
    {'value':'05','text':'(05) May'},
    {'value':'06','text':'(06) Jun'},
    {'value':'07','text':'(07) Jul'},
    {'value':'08','text':'(08) Aug'},
    {'value':'09','text':'(09) Sep'},
    {'value':'10','text':'(10) Oct'},
    {'value':'11','text':'(11) Nov'},
    {'value':'12','text':'(12) Dec'} 
  ];
  
  years: any[] = [
    {'value':'23','text':'2023'},
    {'value':'24','text':'2024'},
    {'value':'25','text':'2025'},
    {'value':'26','text':'2026'},
    {'value':'27','text':'2027'},
    {'value':'28','text':'2028'},
    {'value':'29','text':'2029'},
    {'value':'30','text':'2030'},
    {'value':'31','text':'2031'},
    {'value':'32','text':'2032'},
    {'value':'33','text':'2033'},
  ];
  
  readonly cardMask: MaskitoOptions = {
    mask: [
      ...Array(4).fill(/\d/),
      ' ',
      ...Array(4).fill(/\d/),
      ' ',
      ...Array(4).fill(/\d/),
      ' ',
      ...Array(4).fill(/\d/),
    ],
  };

  readonly maskPredicate: MaskitoElementPredicateAsync = async (el) => (el as HTMLIonInputElement).getInputElement();

  constructor(
    private fb: FormBuilder, 
    private apphttp: AppHttpService, 
    private storage: Storage, 
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private router: Router
  ) {
  }

  formErrors = {
    'name_of_card': '',    
    'card_number': '',    
    'exp_month': '',
    'exp_year': '',
    'cvv_code': '',
    'postalCode': ''
  };
  
  validationMessages = {
    'name_of_card': {
      'required': 'Card holder name is required.',
      'pattern': 'Card holder name is alphabet only'
    },
    'card_number': {
      'required': 'Card Number is required.',
      'minlength': 'Card Number must be 16 characters.',
      'maxlength': 'Card Number should be maximum 16 characters.',
      'pattern': 'Only number allow.'
    },
    'exp_month': { 'required': 'Expiry Month is required.' },
    'exp_year': { 'required': 'Expiry Year is required.' },
    'cvv_code': {
      'required': 'CVV is required.',
      'minlength': 'CVV must be 3 digits.',
      'maxlength': 'CVV should be maximum 3 digits.',
      'pattern': 'Only number allow.'
    },
    'postalCode': {
      'required': 'Postal code is required (Example: A1A1A1)',
      'minlength': 'Postal code is required (Example: A1A1A1)',
      'maxlength': 'Postal code is required (Example: A1A1A1)',
    }
  };

  ngOnInit() {
    this.storage.create();

    this.storage.get('user_id').then((userid)=>{
      this.user_id = userid;
      if(this.user_id) {
        console.log(this.user_id);          
        this.presentLoading();   
        this.apphttp.get('credit_card/'+this.user_id).subscribe({
          next: (result) => {
            this.response = result;
            console.log(this.response);
            this.loadingCtrl.dismiss('');  
          }, error: (err) => {
            this.loadingCtrl.dismiss('');  
            console.log(err);
          }
        });
      }

    })

    this.registerData = this.fb.group({
      'name_of_card': ['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]],
      'card_number': ['', [Validators.required, Validators.pattern('^[0-9* ]+$'), Validators.minLength(19), Validators.maxLength(19)]],
      'exp_month': ['', Validators.required],
      'exp_year': ['', Validators.required],
      'cvv_code': ['', [Validators.required, Validators.pattern('^[0-9]+$'), Validators.minLength(3), Validators.maxLength(3)]],
      'postalCode': ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]+$'), Validators.minLength(6), Validators.maxLength(6)]],      
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

  do_credit_card(registerCredentials) {
    console.log(registerCredentials);
    
    this.presentLoading();

    this.apphttp.post('credit_card/'+this.user_id, registerCredentials).subscribe({
      next: (result) => {
        this.responseData = result;
        
        console.log(this.responseData);

        this.loadingCtrl.dismiss('loading');

        if(this.responseData.error_msg)
        this.presentAlert('Error', this.responseData.error_msg);

        if(this.responseData.success_msg)
        this.presentAlert('Success', this.responseData.success_msg);
        
      }, 
      error: (err) => {
        this.loadingCtrl.dismiss('loading');
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

  add_update() {
    this.router.navigate(['/user/paynow']);
  }

  change_month(month) {
    
    month = (month-1);
    month = month<=0 ? 0 : month;
    if(month>0) {
  
      let price 	= (this.package * month);
      let tax 	= (price * this.tax)/100; 
      let amount 	= price + tax;

      console.log(price+'----'+tax+'----'+amount);
      
      this.my_balance = Number(amount) + Number(this.my_balance);
    }
  }

}
