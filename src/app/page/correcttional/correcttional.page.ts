import { Component, OnInit } from '@angular/core';
import { LoadingController, NavController } from '@ionic/angular';
import { AppHttpService } from 'src/app/services/app-http.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-correcttional',
  templateUrl: './correcttional.page.html',
  styleUrls: ['./correcttional.page.scss'],
})
export class CorrecttionalPage implements OnInit {

  logo: string = environment.logo;
  items: any; 
  data:any;
  slug: string; 

  constructor( 
    private apphttp: AppHttpService, 
    private loadingCtrl: LoadingController) 
  {
    this.institutions(); 
  }

  async presentLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Please wait...',
      duration: 2000,
      spinner: 'bubbles'
    });
    await loading.present();
  }

  institutions() {
    this.presentLoading();
    this.apphttp.get('institutions').subscribe({
      next: (result) => {
        let response:any = result;
        this.items = response.model;
        this.data = this.items;
        this.loadingCtrl.dismiss(''); 
      }, error: (err) => {
        console.log(err);
      }
    });   
  }

  getItems(ev) {
    // set val to the value of the ev target
    var val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.data = this.items.filter((item) => { 
        return ((item.title.toLowerCase().indexOf(val.toLowerCase()) > -1) || (item.full_address.toLowerCase().indexOf(val.toLowerCase()) > -1) || (item.phone.toLowerCase().indexOf(val.toLowerCase()) > -1));
      })
    } else {
      this.data = this.items;
    }
  } 

  ngOnInit() {
  }

}
