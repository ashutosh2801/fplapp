import { Component, OnInit } from '@angular/core';
import { LoadingController, AlertController } from '@ionic/angular';
import { AuthService } from  '../../services/auth.service';
import { environment } from 'src/environments/environment';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { AppHttpService } from 'src/app/services/app-http.service';
//import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  logo: string = environment.logo;
  account_id: number = 0;
  response: any = [];
  user_id: string = '';
  responseData: any = {}; 

  public children = [ 
    {
      title:'My Profile',
      sub_title:'Edit Contact/Login Information and message notifications', 
      submenu: [ 
        { title: 'Edit Contact Info', url: '/user/contact-info', icon: 'logo-usd'},
        { title: 'View FedPhoneLine Info', url: '/user/fedphoneline-info', icon: 'logo-usd'},
        { title: 'Change Password', url: '/user/change-password', icon: 'logo-usd'} 
      ] 
    },
    {
      title:'Call Forwarding', 
      sub_title:'Change Forwarding Number',
      submenu: [ 
        { title: 'Edit forwarding numbers', url: '/user/call-forwarding', icon: 'logo-usd'}
      ] 
    },
    {
      title:'Account Management', 
      sub_title:'Switch Account Package/Terminate Account',
      submenu: [ 
        { title: 'Switch Call Package', url: '/user/upgrade', icon: 'logo-usd'},
        { title: 'Terminate Account', url: '/user/terminate', icon: 'logo-usd'}
      ] 
    },
    {
      title:'Transfer FedPhoneLine Number', 
      sub_title:'',
      submenu: [ 
        { title: 'Click here if you need a New FedPhoneLine Number (Loved One Transferring or Need an Additional Number)', url: '/user/new-number', icon: 'logo-usd'}
      ] 
    },
    {
      title:'Payment Information', 
      sub_title:'Update Payment Information',
      submenu: [ 
        { title: 'Setup Auto Pay', url: '/user/auto-recharge', icon: 'logo-usd'},
        { title: 'Update Credit Card info', url: '/user/credit-card', icon: 'logo-usd'},
        { title: 'Payment History', url: '/user/order', icon: 'logo-usd'}
      ] 
    },
    {
      title:'Billing Information', 
      sub_title:'Check Referral Discounts',
      submenu: [ 
        { title: 'Order History', url: '/user/order', icon: 'logo-usd'},
        { title: 'Referral Code', url: '/user/referral', icon: 'logo-usd'}
      ] 
    },
    {
      title:'Call Log', 
      sub_title:'View your calls (call duration is in seconds)',
      submenu: [ 
        { title: 'VIEW MONTHLY CALL LOG', url: '/user/call-time', icon: 'logo-usd'}
      ] 
    }
  ];
  //private _storage: Storage | null = null;
  
  async presentLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Please wait...',
      duration: 2000,
      id: 'login'
    });

    loading.present();
  }

  async presentAlert(title:string, text:string) {
    const alert = await this.alertCtrl.create({
      header: title,
      //subHeader: text,
      message: text,
      buttons: ['OK'],
    });

    await alert.present();
  }

  async ionViewWillEnter() {

    console.log( 'ionViewWillEnter - Dashboard' );
    this.storage.create();
      
    this.storage.get('user_id').then((val)=>{
      this.user_id = val;
      if(this.user_id) {
        this.presentLoading();
        console.log(this.user_id);
        
        this.apphttp.get(`dashboard/${this.user_id}`).subscribe({
          next: (data) => {
            //this.storage.set('response', data);
            this.response = data;
            console.log(this.response);
            
            if(data.status==='2') {
              this.presentAlert("Account Terminated", data.error_msg);
              this.storage.clear();
              this.auth.setUserInfo(null);
              this.user_id = null;
              this.response = null;
              this.router.navigate(['/login']);
            }
            // if(data.status==='1') {
            //   this.response = data;
            // }
            else if(data.error_msg) {
              this.presentAlert("Error", data.error_msg);
            }
          }, error: (err) => {
            console.log(err);
            this.router.navigate(['/login']);
          }
        });
      }
      else {
        this.router.navigate(['/login']);
      }
    });
  }

  ngOnInit() {
    console.log( 'ngOnInit - Dashboard' );
  }

  constructor(
    private storage: Storage,
    private apphttp: AppHttpService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private router: Router,
    private auth: AuthService
    ) {
      console.log( 'Constructor - Dashboard' );      
   }
}
