import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { AppHttpService } from 'src/app/services/app-http.service';
import { environment } from 'src/environments/environment';
import { Storage } from '@ionic/storage-angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-step3',
  templateUrl: './step3.page.html',
  styleUrls: ['./step3.page.scss'],
})
export class Step3Page implements OnInit {

  logo: string = environment.logo;
  responseData: any;
  slides1: any;
  slides: any;
  userid: number;
  telephone: number;
	
  constructor(    
    private apphttp: AppHttpService,
    private storage: Storage,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController) {} 
  
  back() {
    this.router.navigate(['/signup/step2']);
  }

  public signup(package_id) {
    
    if(this.userid!==null) {  
      console.log(package_id);   
      this.apphttp.get(`register3/${this.userid}?package_id=${package_id}`).subscribe({
        next: (result) => {
          console.log(result);
          this.responseData = result;
          if(this.responseData.status=='success') {
            this.storage.set('activation_fee', result.activation_fee);
            this.storage.set('monthly_fee', result.monthly_fee);
            this.storage.set('calltype', result.call_type);
            this.router.navigate(['/signup/step4']);
          }
        }, error: (err) => {
          console.log(err);
        }
      });
    }
    else {
      this.showPopup("Error", 'Invalid code!');  
    }
  }

  async showPopup(title: string, text: string) {
    let alert = await this.alertCtrl.create({
      header: title,
      subHeader: text,
      buttons: [
        {
          text: 'OK',
          handler: data => {
            //if (this.createSuccess) {
              //this.nav.popToRoot();
            //}
          }
        }
      ]
    });
    await alert.present();
  }

  async presentLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Please wait...',
      duration: 2000,
      spinner: 'bubbles'
    });
    await loading.present();
  }

  ngOnInit() {
      this.storage.create();
      this.storage.get('userid').then((val) => {
        if(val===null) {
          this.router.navigate(['/signup/step1']);
        }
        else {
          this.presentLoading();
          this.userid = val;
          this.apphttp.get(`register3/${this.userid}`).subscribe({
            next: (result) => {
              console.log(result);
              //this.slides1 = result;
              this.slides = result.item;
              this.loadingCtrl.dismiss('');
            }, error: (err) => {
              console.log(err);
            }
          });
        }

      });

      this.storage.get('telephone').then((val) => {
        if(val!=null) {
          console.log(val);
          this.telephone = val;
        }
      });
  }

}
