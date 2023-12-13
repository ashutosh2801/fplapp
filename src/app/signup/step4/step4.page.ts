import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, IonModal, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { AppHttpService } from 'src/app/services/app-http.service';
import { environment } from 'src/environments/environment';
import { ConfirmPage } from '../confirm/confirm.page';
import { MaskitoOptions, MaskitoElementPredicateAsync } from '@maskito/core';

@Component({
  selector: 'app-step4',
  templateUrl: './step4.page.html',
  styleUrls: ['./step4.page.scss'],
})
export class Step4Page implements OnInit {

  logo: string = environment.logo;
  tooltipEvent: 'click' | 'hover' | 'press' = 'click';
  showArrow: boolean = true;
  duration: number = 3000;
  position: 'top';
  registerData: FormGroup;
  createSuccess = false;
  responseData : any;
  registerCredentials : any;
  loading: any;
  modelData: any;
  @ViewChild(IonModal) modal: IonModal;
  user_id: string = '';
  calltype: string = 'Calling Card';
  topup: any = [
    {'amount': 10},
    {'amount': 20},
    {'amount': 30},
    {'amount': 50},
    {'amount': 100},
    {'amount': 200},
  ];
  activation_fee = 0;
  monthly_fee = 0;
  checkMe: boolean = true;
  default_topup = 20;

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
    private router: Router,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private modalCtrl: ModalController,
    //private events:Events,
    private alertCtrl: AlertController ) { 
      
  } 

  async presentToast(msg: string) {
    let toast = await this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'top',
      //dismissOnPageChange: true
    });
    await toast.present();
  }

  back() {
    this.router.navigate(['/signup/step3']);
  }

  formErrors = {    
    'card': '',    
    'name_of_card': '',    
    'card_number': '',    
    'exp_month': '',
    'exp_year': '',
    'cvv_code': '',
    'postalCode': '',
    'acknowledge': '',
    'terms': '',
    'privacy': '',
    'balance_term': ''
  };
  
  validationMessages = {
		'card': {
      'required': 'Payment method is required.',
    },
		'name_of_card': {
      'required': 'Card holder name is required.',
      'pattern': 'Card holder name is alphabet only'
    },
    'card_number': {
      'required': 'Card Number is required.',
      'minlength': 'Card Number must be 16 digits.',
      'maxlength': 'Card Number should be maximum 16 digits',
    },
    'exp_month': { 'required': 'Expiry Month is required.' },
    'exp_year': { 'required': 'Expiry Year is required.' },
    'cvv_code': {
      'required': 'CVV is required',
      'minlength': 'CVV must be 3 digits',
      'maxlength': 'CVV should be maximum 3 digits',
    },
    'postalCode': {
      'required': 'Postal code is required (Example: A1A1A1)',
      'minlength': 'Postal code is required (Example: A1A1A1)',
      'maxlength': 'Postal code is required (Example: A1A1A1)',
    },
    'acknowledge': { 'required': 'Acknowledgement checkbox is required' },
    'terms': { 'required': 'Terms and conditions checkbox is required.' },
    'privacy': { 'required': 'Privacy policy checkbox is required.' },
    'balance_term': { 'required': 'Balance term checkbox is required.' }
  };

  redirect(url: string) {
    window.open (url);
  }

  ngOnInit() {

    this.storage.create();
    this.storage.get('userid').then((val) => {
      if(val===null) {
        this.router.navigate(['/signup/step1']);
      }
      this.user_id = val;
      this.registerData.get('user_id').setValue( this.user_id );
    });
    this.storage.get('calltype').then((val) => {
      this.calltype = val;
      console.log(this.calltype);
      this.registerData.get('calltype').setValue( this.calltype );
    });
    this.storage.get('activation_fee').then((val) => {
      this.activation_fee = val;
      //this.registerData.get('activation_fee').setValue( this.activation_fee );
    });
    this.storage.get('monthly_fee').then((val) => {
      this.monthly_fee = val;
      //this.registerData.get('monthly_fee').setValue( this.monthly_fee );
    });

    this.registerData = this.fb.group({
      'card': ['CCard'],
      'name_of_card': ['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]],
      'card_number': ['', [Validators.required, Validators.pattern('^[0-9* ]+$'), Validators.minLength(19), Validators.maxLength(19)]],
      'exp_month': ['', Validators.required],
      'exp_year': ['', Validators.required],
      'cvv_code': ['', [Validators.required, Validators.pattern('^[0-9]+$'), Validators.minLength(3), Validators.maxLength(3)]],
      'postal_code': ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]+$'), Validators.minLength(6), Validators.maxLength(6)]],
      'acknowledge': [false, Validators.requiredTrue],
      'terms': [false, Validators.requiredTrue],
      'privacy': [false, Validators.requiredTrue],
      'balance_term': [true],
      'topup': ['20'],
      'calltype': [this.calltype],
      'user_id': [this.user_id]
    });

    this.registerData.valueChanges.subscribe((data)=>{
      this.logValidationErrors(this.registerData);
    });
    
  }
	
	async showLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Please wait... We are creating your account.',
    });
    await loading.present();
  }

  onWillDismiss(event: Event) {
    // const ev = event as CustomEvent<OverlayEventDetail<string>>;
    // if (ev.detail.role === 'confirm') {
    //   this.message = `Hello, ${ev.detail.data}!`;
    // }
  }
  
  async openModal() {    
    const modal = await this.modalCtrl.create({component: ConfirmPage});
    await modal.present();
  }

  optionsFn(e: any) {
    this.default_topup = e.target.value;
    console.log(this.default_topup)
    this.registerData.get('topup').setValue( this.default_topup );
  }
  
  async confirm(Data: any) {
      console.log(Data);
      const modal = await this.modalCtrl.create({
        component: ConfirmPage,
        componentProps: {'data': Data}
        // componentProps: {
        //   'model_title': "Nomadic model's reveberation"
        // }
      });
      modal.onDidDismiss().then((modelData) => {
        // if (modelData !== null) {
        //   this.modelData = modelData;
        //   console.log('Modal Data : ' + this.modelData);
        // }
      });
      return await modal.present();

    //const modal = await this.modalCtrl.create({component: FinalPage});	
    //await modal.present();
    // modal.onDidDismiss((data)=>{
    //   if(data!='Cancel') {
    //     this.signup(data);
    //   }
    // });
  }

  public signup(registerCredentials) {
    if(this.user_id!=null) {
      this.showLoading();
      this.apphttp.post(`signup5/${this.user_id}`, registerCredentials).subscribe({
        next: (result) => {
          this.responseData = result;
          this.loading.dismiss();
          if(this.responseData.status=='success') {  
            this.storage.clear();    
            //this.events.publish('user:loggedout');
            //this.events.publish('tab:loggedout');
            //this.openModal({component: SignupFinalPage, componentProps: this.responseData});	
            //this.router.navigate(SignupFinalPage, this.responseData);		
          }
          else {
            if(this.responseData.msg) {
              this.showPopup("Error", this.responseData.msg);  
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
          console.log(err);
        }
      });
    }
    else {
      this.presentToast('Something went wrong! Ples try later.');
      this.router.navigate(['signup/step1']);
    }
  }

  async showPopup(title, text) {
    let alert = await this.alertCtrl.create({
      header: title,
      subHeader: text,
      buttons: [{
        text: 'OK',
        handler: data => {
          //if (this.createSuccess) {
            //this.nav.popToRoot();
          //}
        }
      }]
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
  
  months: any[] = [
    {'value':'01','text':'(01)Jan'},
    {'value':'02','text':'(02)Feb'},
    {'value':'03','text':'(03)Mar'},
    {'value':'04','text':'(04)Apr'},
    {'value':'05','text':'(05)May'},
    {'value':'06','text':'(06)Jun'},
    {'value':'07','text':'(07)Jul'},
    {'value':'08','text':'(08)Aug'},
    {'value':'09','text':'(09)Sep'},
    {'value':'10','text':'(10)Oct'},
    {'value':'11','text':'(11)Nov'},
    {'value':'12','text':'(12)Dec'} 
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

}