import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';
import { Storage } from '@ionic/storage';
import { AppHttpService } from 'src/app/services/app-http.service';

interface Forwaring {
  number: number;
  description: string;
}

@Component({
  selector: 'app-call-forwarding',
  templateUrl: './call-forwarding.page.html',
  styleUrls: ['./call-forwarding.page.scss'],
})
export class CallForwardingPage implements OnInit {

  logo: string = environment.logo;
  registerData : FormGroup;
  isEnable: boolean = false;
  public items: FormArray;
  buttonDisabled = false;
  buttonDisabled2 = false;
  total:number = 0;
  contacts1: Forwaring[];
  timeout=0;

  formErrors: any = {
    'timeout':'',
    'number': '',
    'description': ''
  };
  validationMessages: any = {
    'timeout': {
      'required': 'Number of Rings is required',
    },
    'number': {
      'required': 'Telephone number is required.',
      'maxLength': 'Telephone number should be maximum 11 digits',
      'minLength': 'Telephone number should be minimum 10 digits'
    },
    'description': {
      'required': 'Description is required.',
      'minLength': 'Must enter at least 5 characters (no spaces)',
      'removeMultiSpaces': 'Multiple space not allowed'
    }
  };
  numbers: any[] = [ 
    //{"id":"1"},    
    {"id":"2"},    
    {"id":"3"},
    {"id":"4"}, 
    {"id":"5"},
    {"id":"6"},
    {"id":"7"},
    {"id":"8"},
    //{"id":"9"},
    //{"id":"10"}
  ];
  data = [];
  user_id: string;

  constructor(
    private fb: FormBuilder,
    private loadingCtrl: LoadingController,
    private alrtCtrl: AlertController,
    //rivate auth: AuthService,
    private apphttp: AppHttpService,
    private storage: Storage
  ) {

   }

  ngOnInit() {

    this.storage.create();
    this.storage.get('user_id').then((val) => {
      if(val!=null) {
        this.user_id = val;
        this.apphttp.get(`change_forwarding_number/${val}`).subscribe({
          next: (result) => {
            let response:any = result;
            this.data = response.contacts; 
            this.total = response.total; 
            this.timeout = response.timeout>1 ? response.timeout : "4"; 

            this.buttonDisabled = this.total>1 ? false : true;
            this.isEnable = (this.total>1) ? false : true;
            
            console.log('2 -> ',this.timeout)
            this.registerData.get('timeout').setValue( this.timeout );

            this.items = this.contactFormGroup;
            
            let i=0;
            this.data.forEach(element => {
              this.items.push( this.createItem() );
              this.items.controls[i].get('number').setValue(element.number);
              this.items.controls[i].get('description').setValue(element.description);
              i++;
            });
            
          }, error: (err) => {
            console.log(err);
          }
        });
      }
    });

    console.log('1 -> ',this.timeout);

    this.registerData = this.fb.group({
      'timeout': [this.timeout, Validators.required],
      //'number': ['', Validators.required],
      'contacts': this.fb.array( [] )
    });
    
    this.items = this.contactFormGroup;

    this.registerData.valueChanges.subscribe((data)=>{
      this.logValidationErrors(this.registerData);
    });
  }

  // returns all form groups under contacts
  get contactFormGroup() {
    return this.registerData.get('contacts') as FormArray;
  } 

  do_call_forwarding(formData: any) {
    this.presentLoading();

    this.apphttp.post(`change_forwarding_number/${this.user_id}`,formData).subscribe((data) => {
      console.log(data)
      let response:any = data;
      this.loadingCtrl.dismiss();
      if(response.success_msg) {
        this.data = response.contacts; 
        this.total = response.total; 
        this.timeout = response.timeout;
        this.presentAlert('Success', response.success_msg);
        //this.registerData.reset();
      }
      else if(response.error_msg) {
        this.presentAlert('Error', response.error_msg);
      }
      else{
        this.presentAlert('Error', response);
      }
    });
  }
  description: string = 'Home Phone';  

  removeMultiSpaces(control: FormControl){
    const string = control.value;
    const valid = string.includes('  ');
    return !valid ? null : {
      removeMultiSpaces: {
          valid: false
      }
  }
  }

  loadItem(contact: any) {
    return this.fb.group({
      'number': [contact.number, Validators.compose([Validators.required, Validators.pattern('^[0-9]+$'), Validators.minLength(10), Validators.maxLength(10)])],
      'description': [contact.description, Validators.compose([Validators.required, Validators.minLength(5), this.removeMultiSpaces])]
    });  
  }

  createItem(): FormGroup {
    return this.fb.group({
      'number': ['', Validators.compose([Validators.required, Validators.pattern('^[0-9]+$'), Validators.minLength(10), Validators.maxLength(10)])],
      'description': ['Home Phone', Validators.compose([Validators.required, Validators.minLength(5), this.removeMultiSpaces])]
    });
  }

  addItem() {
    if( this.contactFormGroup.value.length< this.total  ) {
      this.items.push( this.createItem() );
      let total = this.total + this.contactFormGroup.value.length;
      if(total==5)
      this.buttonDisabled2 = true;
    }
    else {
      this.buttonDisabled2 = true;
    }
  }

  async delete(id: number){
    const loading = await this.loadingCtrl.create({
      message: 'Deleting...',
      duration: 2000,
      spinner: 'bubbles'
    });
    await loading.present();

    let data = {'id':id};
    this.apphttp.post(`delete_forwarding_number/${this.user_id}`, data).subscribe({
      next: (result) => {
        let response:any = result;
        this.data = response.contacts; 
        this.total = response.total; 
        this.timeout = response.timeout; 
        this.loadingCtrl.dismiss();
      }, error: (err) => {
        console.log(err);
      }
    });
    
  }

  async removeItem(index: number) {
    const loading = await this.loadingCtrl.create({
      message: 'Deleting...',
      duration: 2000,
      spinner: 'bubbles'
    });
    await loading.present();

    this.items.removeAt(index);
    this.buttonDisabled = false;
  }

  async presentLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Loading...',
      duration: 2000,
      spinner: 'bubbles'
    });
    await loading.present();
  }
  
  async presentAlert(text: string, message: string) {
    const alert = await this.alrtCtrl.create({
      header: text,
      //subHeader: 'Subtitle',
      message: message,
      buttons: ['OK']
    });
  
    await alert.present();

    //this.items.pop();
    //this.contactFormGroup.removeAt(this.contactFormGroup.length - 1);
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
