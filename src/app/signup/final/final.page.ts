import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { AppHttpService } from 'src/app/services/app-http.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-final',
  templateUrl: './final.page.html',
  styleUrls: ['./final.page.scss'],
})
export class FinalPage implements OnInit {

  logo: string = environment.logo;
  response: any = {};

  login() {
    this.router.navigate(['/login']);
  }

  constructor(
    private loadingController: LoadingController,
    private route: ActivatedRoute,
    private router: Router,
    //private apphttp: AppHttpService
  ) {
    //this.presentLoading(); 
    //this.loadingController.dismiss('');
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Please wait...',
      duration: 2000,
      spinner: 'bubbles'
    });
    await loading.present();
  }

  ngOnInit() {
    this.response.card_issue = this.route.snapshot.params['card_issue'] ? this.route.snapshot.params['card_issue'] : '';
    this.response.msg = this.route.snapshot.params['msg'];
    this.response.status = this.route.snapshot.params['status'];
    this.response.account_id = this.route.snapshot.params['account_id'];    
  }

}
