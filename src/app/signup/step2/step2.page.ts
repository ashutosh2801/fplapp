import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AlertController, ToastController, LoadingController } from '@ionic/angular';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { AppHttpService } from 'src/app/services/app-http.service';
import { Router } from '@angular/router';
import { MaskitoOptions, MaskitoElementPredicateAsync } from '@maskito/core';

@Component({
  selector: 'app-step2',
  templateUrl: './step2.page.html',
  styleUrls: ['./step2.page.scss'],
})
export class Step2Page implements OnInit {

  logo: string = environment.logo;
  registerData: FormGroup = this.fb.group({});
  createSuccess = false;
  responseData : any;
  registerCredentials : any;
  userid = '0';
  telephone: string;
  mismatchedPhone = false;
  telephone3='';
  ins: any;
  loading: any; 
  insLists: any;
  cityLists: any;
  account_id: any;
  name: string;
  call_type: string;
  province_id: string;
  ins_id: string;
  city_id: string;

  provinces: any[] = [
    {"id":"60","name":"Alberta"},
    {"id":"61","name":"British Columbia"},
    {"id":"62","name":"Manitoba"},
    {"id":"63","name":"New Brunswick"},
    {"id":"66","name":"Nova Scotia"},
    {"id":"68","name":"Ontario"},
    {"id":"70","name":"Québec"},
    {"id":"71","name":"Saskatchewan"}
  ];
  
  formErrors = {
    'call_type': '',
    'province': '',
    'institution': '',
    'city': '',
    'account_id': '',
    'telephone3': '',
    'confirm_telephone3': ''
  };
  
  validationMessages = {
    'call_type': {
      'required': 'Call type is required.'
    },
    'province': {
      'required': 'Province is required.'
    },
    'institution': {
      'required': 'Institution is required.'
    },
    'city': {
      'required': 'City is required.'
    },
    'account_id': {
      'required': 'FedPhoneLine number is required.',
      'number': 'FedPhoneLine number must be numbers.'
    },
    'telephone3': {
      'required': 'Phone Number is required',
      'minlength': 'Phone Number must be 10 digits (Ex. +1 (416) 222-3333)',
      'maxlength': 'Phone Number should be 10 digits (Ex. +1 (416) 222-3333)',
    },
    'confirm_telephone3': {
      'required': 'Confirm Phone Number is required.',
      'minlength': 'Confirm Phone Number must be 10 digits (Ex. +1 (416) 222-3333)',
      'maxlength': 'Confirm Phone Number should be 10 digits (Ex. +1 (416) 222-3333)',
      'equalTo': 'Confirm Phone Number must match'
    }
  };

  readonly phoneMask: MaskitoOptions = {
    mask: ['+', '1', ' ', '(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/],
  };
  readonly maskPredicate: MaskitoElementPredicateAsync = async (el) => (el as HTMLIonInputElement).getInputElement();

  updateToDo(val) { 
    if(val.value) { 
      this.telephone3 = this.telephone; 
    } else { 
      this.telephone3 = ''; 
    }   
  }
	
	constructor( 
    private fb: FormBuilder, 
    private apphtpp: AppHttpService,
    private storage: Storage,
    private router: Router,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController ) {

  }

  ngOnInit() {
    this.storage.create();
    this.storage.get('userid').then((val) => {
      if(val===null) {
        this.router.navigate(['/signup/step1']);
      }
      this.userid = val;
      console.log(this.userid);
    });

    if(this.userid===null) {
      this.router.navigate(['signup/step1']);
    }

    this.storage.get('telephone').then((val) => {
      this.telephone = val;
    });

    this.registerData = this.fb.group({
      'call_type': ['', Validators.required],
      'province': ['', Validators.required],
      'institution': ['', Validators.required],
      'city': [''],
      'account_id': [''],
      'telephone3': ['', [Validators.required, Validators.minLength(17), Validators.maxLength(17)]],
      'confirm_telephone3': ['', [Validators.required, Validators.minLength(17), Validators.maxLength(17), this.equalto('telephone3')]],
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

  loadSabhi(e: any) {
    this.call_type = e.target.value;
    this.registerData.get('city').setValue( '' );
    this.registerData.get('account_id').setValue( '' );
  }

  loadIns(e: any, group: FormGroup = this.registerData) {  
    this.showLoading();  
    this.province_id = e.target.value;
    const formData = { 'call_type':group.controls['call_type'].value, 'province':group.controls['province'].value };
    //const formData = { 'call_type':this.call_type, 'province':this.province_id };
    //const formData = { };
    this.apphtpp.post('get_institutes', formData).subscribe({
      next: (result) => {
        console.log(result);
        this.insLists = result;
        this.cityLists = [];
        this.account_id = '';
        this.loadingCtrl.dismiss();
      }, error: (err) => {
        this.loadingCtrl.dismiss();
        console.log(err);
      }
    });    
  }

  loadCity(e: any, group: FormGroup = this.registerData) {
    this.showLoading(); 
    this.ins_id = e.target.value; 
    var formData = { 'call_type':group.controls['call_type'].value, 'ins':group.controls['institution'].value };
    //const formData = { 'call_type':this.call_type, 'ins':this.ins_id, 'province':this.province_id };
    console.log(formData);
    this.apphtpp.post('get_city', formData).subscribe({
      next: (result) => {
        console.log(result);
        if(result.length===0) {
          this.showPopup("Warning", 'Something went wrong! Please check selected items');  
        }
        else {
          this.cityLists = result;
          this.city_id = this.cityLists[0].name;
          this.registerData.get('city').setValue( this.cityLists[0].name );
          this.account_id = '';
          this.loadingCtrl.dismiss();
          this.loadAccount();
        }
      }, error: (err) => {
        console.log(err);
        this.loadingCtrl.dismiss();
      }
    });    
  }

  loadAccount(group: FormGroup = this.registerData) {
    //this.showLoading(); 
    var formData = { 'call_type':group.controls['call_type'].value, 'province':group.controls['province'].value, 'ins':group.controls['institution'].value, 'city':group.controls['city'].value };
    //const formData = { 'call_type':this.call_type, 'ins':this.ins_id, 'province':this.province_id, 'city': this.city_id };
    console.log(formData);
    this.apphtpp.post('get_account_id', formData).subscribe({
      next: (result) => {
        this.account_id = result;
        this.registerData.get('account_id').setValue( this.account_id );
        this.loadingCtrl.dismiss();
      }, error: (err) => {
        console.log(err);
        this.loadingCtrl.dismiss();
      }
    });    
  } 

  async showLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Please wait...',
      id: 'loading'
    });
    await loading.present();
  }
  
	public signup(registerCredentials){

    console.log(registerCredentials);
    if(this.account_id===null) {
      this.showPopup("Warning!", 'Unable to find FedPhoneLine Number. Please confirm province and institute agian');  
    }

    if(this.userid!==null) {  
      this.showLoading();
      this.apphtpp.post(`register2/${this.userid}`, registerCredentials).subscribe({
        next: (result) => {
          this.responseData = result;      
          console.log(this.responseData);

          if(this.responseData.status=='success') {
            this.router.navigate(['signup/step3']);
          }
          else {

            if(this.responseData.msg) {
              this.showPopup("Error", this.responseData.msg);  
            }
            else {
              for (const errorMsg in this.responseData) {
                if(errorMsg==='Signup_account_id') {
                  this.showPopup("Error", `There are no numbers available for this institution`); break;
                }
                else if (errorMsg) {
                  this.showPopup("Error", `Invalid ${errorMsg}!`); break;
                }
              }
            }     
          }
          this.loadingCtrl.dismiss();
        }, error: (err) => {
          // Error log
          this.loadingCtrl.dismiss();
          this.showPopup("Error", `Invalid ${err}!`);
        }
      });
    }
    else {
      this.loadingCtrl.dismiss();
      this.showPopup("Error", 'Invalid code!');  
    }
  }

  

  async presentToast(msg) {
    let toast = await this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'top',
      //dismissOnPageChange: true
    });
    toast.present();
  }

  async showPopup(title, text) {
    let alert = await this.alertCtrl.create({
      header: title,
      message: text,
      buttons: [
        {
          text: 'OK',
          handler: data => {
            //if (this.createSuccess) {
              //this.navCtrl.popToRoot();
            //}
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

  back() {
    this.router.navigate(['/signup/step1']);
  }

}
