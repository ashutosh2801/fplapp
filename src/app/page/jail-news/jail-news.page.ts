import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { AppHttpService } from 'src/app/services/app-http.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-jail-news',
  templateUrl: './jail-news.page.html',
  styleUrls: ['./jail-news.page.scss'],
})
export class JailNewsPage implements OnInit {

  logo: string = environment.logo;
  items: any; 
  slug: string; 

  constructor( private apphttp: AppHttpService, private loadingCtrl: LoadingController) {
    
    this.latest_news(); 
    
  }

  async presentLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Please wait...',
      duration: 2000,
      spinner: 'bubbles'
    });
    await loading.present();
  }

  latest_news() {
    this.presentLoading();
    this.apphttp.get('latest_news').subscribe({
      next: (result) => {
        let response:any = result;
        this.items = response.news;
        //console.log(result);
        this.loadingCtrl.dismiss(); 
      }, error: (err) => {
        console.log(err);
      }
    });
  }

  ngOnInit() {
  }

}
