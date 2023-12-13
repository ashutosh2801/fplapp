import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { AppHttpService } from 'src/app/services/app-http.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-terminate',
  templateUrl: './terminate.page.html',
  styleUrls: ['./terminate.page.scss'],
})
export class TerminatePage implements OnInit {

  logo: string = environment.logo;
  user_id = '';
  loading: any;
  call_type = 'default';

  constructor(
    //public events:Events, 
    //private navCtrl: NavController,
    private storage: Storage, 
    private apphttp: AppHttpService, 
    private alertCtrl: AlertController, 
    private loadingCtrl: LoadingController,
    private router: Router
  ) {
      this.storage.create();
      this.storage.get('user_id').then((userid)=>{
        this.user_id = userid;
      });
   }

  ngOnInit() {
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

  async terminate_account() {
    const alert = await this.alertCtrl.create({
      header: 'Are you sure?',
      buttons: [
        {
          text: 'OK',
          handler: (data) => {
            
            this.presentLoading();

            this.apphttp.get('terminate_account/'+this.user_id).subscribe({
              next: (result) => {
                let responseData:any = result;
                console.log(responseData);
      
                if(responseData.error_msg) {
                  this.presentAlert('Error', responseData.error_msg);
                }

                if(responseData.success_msg) {
                  this.presentAlert('Success', responseData.success_msg);
                }

                this.loadingCtrl.dismiss('loading');  
              }, error: (err) => {
                console.log(err);
              }
            });
          }
        },
        {
          text:'Cancel'}
      ]
    });
    await alert.present();
  }

  async presentAlert(title:string, text: string) {
    const alert = await this.alertCtrl.create({
      header: title,
      //subHeader: 'Subtitle',
      message: text,
      buttons: [
        {
          text: 'OK',
          handler: data => {
            this.router.navigate(['/login']); 
            //this.storage.clear();
            //this.events.publish('user:loggedout');
            //this.events.publish('tab:loggedout');
            //this.navCtrl.setRoot(HomePage);         
          },          
        }
      ]
    });
  
    await alert.present();
  }

}
