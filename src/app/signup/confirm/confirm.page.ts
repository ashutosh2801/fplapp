import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { AlertController, IonModal, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { AppHttpService } from 'src/app/services/app-http.service';
import { Storage } from '@ionic/storage-angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.page.html',
  styleUrls: ['./confirm.page.scss'],
})
export class ConfirmPage implements OnInit {

  @Input() name: string;
  @Input() data: any;
  response: any = {};
  responseData: any = {};
  user_id: string;

  constructor(
    private loadingCtrl: LoadingController,
    private modalCtrl: ModalController,
    private alertController: AlertController,
    private toastController: ToastController,
    private apphttp: AppHttpService,
    private storage: Storage,
    private router: Router
  ) { }

  ngOnInit() {
    // this.storage.create();
    // this.storage.get('user_id').then((userid)=>{
    //   this.user_id = userid;
    // })
    
    this.presentLoading();
    this.apphttp.post(`summary/${this.data.user_id}`, this.data).subscribe({
      next: (result) => {
        console.log(result);
        this.response = result;
        this.user_id = this.data.user_id;
        this.loadingCtrl.dismiss('');
      }, 
      error: (err) => {
        this.loadingCtrl.dismiss('');
        console.log(err);
      }
    });
  }
  
  async cancel() {
    await this.modalCtrl.dismiss(null, 'cancel');
  }

  async showLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Please wait....',
      duration: 4000,
      spinner: 'bubbles',
      id: 'loading'
    });
    await loading.present();
  }

  public confirm() {
    this.showLoading();
    const data = this.data;
    const response = this.response;
    const mergedObject = {
      data,
      response
    };
    console.log( mergedObject );

    if(this.user_id!==null) {
      this.showLoading();
      this.apphttp.post(`register4/${this.user_id}`, mergedObject).subscribe({
        next: (result) => {
          console.log( result );
          this.responseData = result;
          if(result.status === 'success' || result.status === 'error') {  
            this.modalCtrl.dismiss(null, 'cancel');  
            //this.router.navigate(['/signup/final', result ]);	
            this.presentAlert("Success", result);
            this.loadingCtrl.dismiss('');
          }
          else {
            if(this.responseData.msg) {
              this.presentAlert("Error", this.responseData.msg);  
            }
            else {
              for (const errorMsg in this.responseData) {
                if (errorMsg) {
                  this.presentAlert("Error", errorMsg); break;
                }
              }
            } 
            this.loadingCtrl.dismiss(''); 
          }
        }, error: (err) => {
          this.loadingCtrl.dismiss('');
          console.log(err);
        }
      });
    }
    else {
      this.presentToast('Something went wrong! Ples try later.');
      this.router.navigate(['signup/step4']);
    }
  }

  async presentToast(text: string) {
    const toast = await this.toastController.create({
      message: text,
      duration: 4000,
      color: 'danger',
      position: 'top'
    });
    toast.present();
  }

  async presentAlert(title: string, message: any) {
    const alert = await this.alertController.create({
      header: title,
      subHeader: '',
      message: message.msg,
      buttons: [
        {
          text: 'OK',
          handler: (data) => {
            if (title==='Success') {
              this.router.navigate(['/signup/final', message ]);	
            }
          }
        }
      ]
    });
  
    await alert.present();
  }

  async presentLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Calculating Order Summary...',
      duration: 2000,
      spinner: 'bubbles'
    });
    await loading.present();
  }

}
