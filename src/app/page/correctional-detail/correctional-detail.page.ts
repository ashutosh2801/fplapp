import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { AppHttpService } from 'src/app/services/app-http.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-correctional-detail',
  templateUrl: './correctional-detail.page.html',
  styleUrls: ['./correctional-detail.page.scss'],
})
export class CorrectionalDetailPage implements OnInit {

  logo: string = environment.logo;
  item: any= {};
  slug: string;

  constructor(
    private apphttp: AppHttpService, 
    private alertCtrl: AlertController, 
    private loadingCtrl: LoadingController, 
    private activatedRoute: ActivatedRoute,
    //private navCtrl: NavController, 
    //private param: NavParams
  ) { 
    //this.slug = this.param.get('slug');
    this.slug = this.activatedRoute.snapshot.params['slug'];
    console.log(this.slug)
    this.presentLoading();
    this.apphttp.get('institution_detail?slug='+this.slug).subscribe({
      next: (result) => {      
        //console.log(result);
        let response:any = result;
        if(response.error) {
          this.presentAlert('Error', response.error);
        }
        else {
          this.item = response.model;
          this.loadingCtrl.dismiss();
          //console.log(this.item);
        }
      }, error: (err) => {
        console.log(err);
      }
    });
  }

  ngOnInit() {
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

  async presentLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Please wait...',
      duration: 2000,
      spinner: 'bubbles'
    });
    await loading.present();
  }

}
