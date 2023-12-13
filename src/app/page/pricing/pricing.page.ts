import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { AppHttpService } from 'src/app/services/app-http.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.page.html',
  styleUrls: ['./pricing.page.scss'],
})
export class PricingPage implements OnInit {

  logo: string = environment.logo;
  package: string = "collect_call";
  package2: string = "collect_call2";
  package3: string = "collect_call3";
  isAndroid: boolean = false;
  responseData: any;
  call_pkg_onqc: any;
  call_pkg_offnet: any;
  calling_pkg_onqc: any;
  calling_pkg_offnet: any;
  slides:any = [];
  slideOpts = { slidesPerView: 1, loop: true, speed: 400 };

  constructor(
    public apphttp: AppHttpService, 
    public loadingCtrl: LoadingController, 
    public router: Router
  ) {
    
    this.presentLoading();
    this.apphttp.get('packages').subscribe({
      next: (result) => {
        this.slides = result;
        console.log(result);
        this.call_pkg_onqc = this.slides.call_pkg_onqc;
        this.call_pkg_offnet = this.slides.call_pkg_offnet;
        this.calling_pkg_onqc = this.slides.calling_pkg_onqc;
        this.calling_pkg_offnet = this.slides.calling_pkg_offnet;
        this.loadingCtrl.dismiss();
        
      }, error: (err) => {
        console.log(err);
        this.loadingCtrl.dismiss();
      }
    });
  }

  async presentLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Please wait...',
      duration: 2000,
      spinner: 'bubbles'
    });
    await loading.present();
  }
  
	continue() {
    this.router.navigate(['/signup/step1']);
  }

  ngOnInit() {
  }

}
