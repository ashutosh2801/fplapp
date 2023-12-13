import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AppHttpService } from '../services/app-http.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-blog-detail',
  templateUrl: './blog-detail.page.html',
  styleUrls: ['./blog-detail.page.scss'],
})
export class BlogDetailPage implements OnInit {

  logo: string = environment.logo;
  item: any = {};
  id: number;

  constructor( 
    private apphttp: AppHttpService, 
    private router: Router, 
    private alertCtrl: AlertController, 
    private loadingCtrl: LoadingController, 
    private activatedRoute: ActivatedRoute
  ) { }
  
  async presentLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Please wait...',
      duration: 2000,
      spinner: 'bubbles'
    });
    await loading.present();
  }

  async presentAlert(text: string) {
    const alert = await this.alertCtrl.create({
      header: 'Error',
      //subHeader: 'Subtitle',
      message: text,
      buttons: ['OK']
    });
  
    await alert.present();
  }

  signup(){
    this.router.navigate(['/signup/step1']);
  }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.params['id'];
    
    this.presentLoading();
    this.apphttp.get(`blog_detail/${this.id}`).subscribe({
      next: (result) => {      
        //console.log(result);
        let response:any = result;
        if(response.error) {
          this.presentAlert(response.error);
        }
        else {
          this.item = response.model;
          this.loadingCtrl.dismiss();
        }
      }, error: (err) => {
        console.log(err);
      }
    });
  }

}
