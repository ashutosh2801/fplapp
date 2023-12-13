import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { AppHttpService } from 'src/app/services/app-http.service';
import { environment } from 'src/environments/environment';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-upgrade',
  templateUrl: './upgrade.page.html',
  styleUrls: ['./upgrade.page.scss'],
})
export class UpgradePage implements OnInit {

  logo: string = environment.logo;
  user_id = '';
  account_id = '';
  current_package = '';
  response: any;
  loading: any;
  registerData : FormGroup = this.fb.group([]);
  registerCredentials : any;
  responseData : any;
  packagecats: any;
  packages: any;
  packagelabel: string;
  basic:any;
  premium:any;

  constructor(
    private fb: FormBuilder,    
    private apphttp: AppHttpService, 
    private storage: Storage, 
    private router:  Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController) 
  {
    this.storage.create();     
    this.storage.get('user_id').then((val) => {      

      if(val!=null) {
        this.user_id = val;
        
        this.presentLoading();

        this.apphttp.get('upgrade/'+this.user_id).subscribe({
          next: (result) => {
            this.response = result;

            let results : any = result;          
            this.account_id = results.account_id;
            this.current_package = results.current_package;

            if(results.call_type=='Collect Call') {
              this.packagelabel = 'Collect Call';
              this.packagecats = [
                {'key':'IONQC','value':'Ontario and Quebec'},
                {'key':'OONQC','value':'Outside of Ontario and Quebec'}
              ];
            } else if(results.call_type=='Calling Card') {
              this.packagelabel = 'Calling Card';
              this.packagecats = [
                {'key':'IONQC','value':'3000 Minute Plans'},
                {'key':'OONQC','value':'8000 Minute Plans'}
              ];
            }          
            this.loadPackage();

            this.loadingCtrl.dismiss('loading');  
          }, 
          error: (err) => {
            console.log(err);
            this.loadingCtrl.dismiss('loading');  
          }
        });
      }
    });
  }

  formErrors = {
    'package_cat': '',
    'package': ''
  };
  
  validationMessages = {
    'package_cat': {
      'required': 'Please select Calling Package Required.'
    },
    'package': {
      'required': 'Please select FedPhoneLine Calling Package.',
    }
  };

  ngOnInit() {
    this.registerData = this.fb.group({
      'package_cat': ['', Validators.required],
      'package':['', Validators.required]
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

  loadPackage(group: FormGroup = this.registerData) {
    this.presentLoading();
    const formData: any = { 'call_type':this.response.call_type, 'location':group.controls['package_cat'].value };
    console.log(formData);
    this.apphttp.post('packages_list', formData).subscribe({
        next: (result) => {   
        
        console.log(result);

        let res:any = result;      
        this.basic = res.BASIC;
        this.premium = res.PREMIUM;
        
        this.loadingCtrl.dismiss('loading');  
      }, error: (err) => {
        console.log(err);
      }
    });
  }

  do_upgrade(registerCredentials) {
    console.log(registerCredentials);
    
    this.presentLoading();

    this.apphttp.post('upgrade/'+this.user_id, registerCredentials).subscribe({
      next: (result) => {
        this.responseData = result;
        
        console.log(this.responseData);

        this.loadingCtrl.dismiss('loading');

        if(this.responseData.error_msg)
        this.presentAlert('Error', this.responseData.error_msg);

        if(this.responseData.success_msg) {
          this.presentAlert('Success', this.responseData.success_msg);
          this.router.navigate(['/user/dashboad']);
        }
        

      }, error: (err) => {
        console.log(err);
      }
    });
  }

  async presentLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Please wait...',
      duration: 2000,
      spinner: 'bubbles',
      id:'loading'
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
}
