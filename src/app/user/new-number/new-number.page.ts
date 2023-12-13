import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { AppHttpService } from 'src/app/services/app-http.service';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-new-number',
  templateUrl: './new-number.page.html',
  styleUrls: ['./new-number.page.scss'],
})
export class NewNumberPage implements OnInit {

  logo: string = environment.logo;
  userid = '';
  user_id = '';
  current_package = '';
  response: any;
  loading: any;
  registerData : FormGroup;
  registerCredentials : any;
  responseData : any;
  packagecats: any;
  packages: any;
  pet: string = "kittens";
  accountid: any;
  insLists: any;
  cityLists: any;

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

  constructor(
    private fb: FormBuilder,    
    private apphttp: AppHttpService, 
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private router: Router,
    private storage: Storage,
    private auth: AuthService
  ) {
    this.storage.create();
    this.storage.get('user_id').then((userid)=>{
      this.userid = userid;
      if(this.userid) {
        this.presentLoading()
        this.apphttp.get('new_number/'+this.userid).subscribe({
          next: (result) => {
            this.response = result;
            //console.log(this.response);
            this.loadingCtrl.dismiss('');  
          }, error: (err) => {
            console.log(err);
          }
        });
      }
    })
  }

  async presentLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Loading data...',
      //duration: 2000,
      spinner: 'bubbles',
      id: 'loading'
    });
    await loading.present();
  }

  formErrors = {
    'loved_province': '',
    'loved_institute':'',
    'loved_city': '',
    'accountid': '',
    'username': '',
    'terminate': ''
  };
  
  validationMessages = {
    'loved_province': {
      'required': 'Province is required.'
    },
    'loved_institute': {
      'required': 'Institution is required.',
    },
    'loved_city': {
      'required': 'City is required.',
    },
    'accountid': {
      'required': 'FedPhoneLine number is required.',
    },
    'username': {
      'required': 'Username is required.',      
      'minlength': 'Username must be greater than 6 characters.',
      'maxlength': 'Username must be less than 16 characters.',
      'pattern': 'Your username must contain only numbers and letters'
    },
    'terminate': {
      'required': 'Termination Date for your old FedPhoneLine number is required',
    }
  };

  ngOnInit() {   

    this.registerData = this.fb.group({
      'loved_province': ['', Validators.required],
      'loved_institute':['', Validators.required],
      'loved_city': ['', Validators.required],
      'accountid': ['', Validators.required],
      'username': ['', Validators.compose([Validators.required,  Validators.minLength(6), Validators.maxLength(16),
        Validators.pattern('^[a-zA-Z0-9]+$')])],
      'terminate': ['', Validators.required]
    });

    this.registerData.valueChanges.subscribe(()=>{
      this.logValidationErrors(this.registerData);
    })
  }

  public do_new_number(registerCredentials) {
    if(this.userid!=null) {
      this.presentLoading(); 
      this.apphttp.post('new_number/'+this.userid, registerCredentials).subscribe({
        next: (result) => {
          console.log(result);
          this.responseData = result;
          this.loadingCtrl.dismiss('');
          if(this.responseData.status==='success') {
            this.presentAlert("Congratulations!", this.responseData.msg, registerCredentials.terminate); 
            //if( registerCredentials.terminate == 1 ) { 
              // this.storage.clear();
              //this.router.navigate(['/user/dashboard']);  
              // this.events.publish('user:loggedout');
              // this.events.publish('tab:loggedout');
            //}
          }
          else {
            if(this.responseData.msg.fm_number) {
              this.presentAlert("Error", this.responseData.msg.fm_number, '0');  
            }
            else if(this.responseData.msg) {
              this.presentAlert("Error", this.responseData.msg, '0');  
            }
            else {
              this.presentAlert("Error", this.responseData.msg, '0');
            }     
          }
        }, error: (err) => {
          // Error log
        }
      });
    }
    else {
      this.presentAlert("Error", 'Please login first!');
      this.router.navigate(['/login']);  
    }
  }

  loadIns(group: FormGroup = this.registerData) {  
    this.presentLoading();  
    //console.log(this.response);
    var formData = { 
      'call_type':this.response.call_type, 
      'province':group.controls['loved_province'].value 
    };
    this.apphttp.post('get_institutes', formData). subscribe({
      next: (result) => {
        this.insLists = result;
        this.cityLists = [];
        this.accountid = '';
        this.loadingCtrl.dismiss('');
      }, error: (err) => {
        console.log(err);
      }
    });    
  }

  loadCity(group: FormGroup = this.registerData) {
    this.presentLoading();  
    var formData = { 
      'call_type':this.response.call_type, 
      'ins':group.controls['loved_institute'].value 
    };
    //console.log(formData);
    this.apphttp.post('get_city', formData).subscribe({
      next: (result) => {
        this.cityLists = result;
        //this.account_id = '';
        this.registerData.get('loved_city').setValue( result[0].id );
        this.loadAccount();
        this.loadingCtrl.dismiss('');
      }, error: (err) => {
        console.log(err);
      }
    });    
  }

  loadAccount(group: FormGroup = this.registerData) {
    this.presentLoading();  
    var formData = { 
      'call_type':this.response.call_type, 
      'province':group.controls['loved_province'].value, 
      'ins':group.controls['loved_institute'].value, 
      'city':group.controls['loved_city'].value 
    };
    //console.log(formData);
    this.apphttp.post('get_account_id', formData).subscribe({
      next: (result) => {
        console.log(result);
        //this.accountid = result;
        //this.registerData.get('accountid').value(result);
        if(result==='No Numbers Available') {
          this.registerData.get('loved_institute').setValue('');
          this.registerData.get('loved_city').setValue('');
          this.presentAlert('Error', 'No Numbers Available on selected Institute!');
        }
        else
        this.registerData.get('accountid').setValue( result );
        this.loadingCtrl.dismiss('');
      }, error: (err) => {
        console.log(err);
      }
    });    
  }

  do_upgrade(registerCredentials) {
    console.log(registerCredentials);
    
    this.presentLoading()

    this.apphttp.post('upgrade/'+this.userid, registerCredentials).subscribe({
      next: (result) => {
        this.responseData = result;
        
        console.log(this.responseData);

        this.loadingCtrl.dismiss('');

        if(this.responseData.error_msg)
        this.presentAlert('Error', this.responseData.error_msg);

        if(this.responseData.success_msg)
        this.presentAlert('Success', this.responseData.success_msg);
        //this.navCtrl.push(ConfirmPage, { msg : this.responseData.success_msg});

      }, error: (err) => {
        console.log(err);
      }
    });
  }

  async presentAlert(title: string, text: string, num: string = '0') {
    const alert = await this.alertCtrl.create({
      header: title,
      message: text,
      buttons: [
        {
          text: 'OK',
          handler: (data) => {
            if (title==='Congratulations!') {
              if(num === '1') {
                this.storage.create();
                this.storage.clear();
                this.auth.setUserInfo(null);
                this.user_id = null;
                this.response = null;
                this.router.navigate(['/login']);
              }
              else {
                this.router.navigate(['/user/dashboard']); 
              }
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
              this.formErrors[key] += messages[errorKey] + ' ';
            }
          }
        }
      }
    });
  } 

}