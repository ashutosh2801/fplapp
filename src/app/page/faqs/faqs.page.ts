import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { AppHttpService } from 'src/app/services/app-http.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-faqs',
  templateUrl: './faqs.page.html',
  styleUrls: ['./faqs.page.scss'],
})
export class FaqsPage implements OnInit {

  logo: string = environment.logo;
  items: any; 
  slug: string; 

  constructor( private apphttp: AppHttpService, private loadingCtrl: LoadingController) {
    
    this.faqs(); 
    
  }
  
  async presentLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Please wait...',
      duration: 2000,
      spinner: 'bubbles'
    });
    await loading.present();
  }

  faqs() {
    this.presentLoading();
    this.apphttp.get('faqs').subscribe({
      next: (result) => {
        let response:any = result;
        this.items = response.faqs;
        //console.log(result);
        this.loadingCtrl.dismiss(); 
      }, error: (err) => {
        console.log(err);
      }
    });   
  }

  getItems(ev) {

    this.faqs(); 

    // set val to the value of the ev target
    var val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.items = this.items.filter((item) => { 
        return ((item.question.toLowerCase().indexOf(val.toLowerCase()) > -1) || (item.answer.toLowerCase().indexOf(val.toLowerCase()) > -1));
      })
    }
  } 

  ngOnInit() {
  }

}
