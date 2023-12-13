import { Component, Optional } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { register } from 'swiper/element/bundle';
import { AppHttpService } from './services/app-http.service';
import { AuthService } from './services/auth.service';
import { Subscription } from 'rxjs';
import { IonRouterOutlet, Platform } from '@ionic/angular';
import { App } from '@capacitor/app';
//import { SplashScreen } from '@capacitor/splash-screen';

register();

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  user_id: string = '';
  account_id = '';
  responseData: any = {}; 
  shownGroup = null;
  sublevel = null;
  showSplash = true; 
  activePage: any;
  userSub:  Subscription;

  public appPages = [
    { title: 'Home', url: '/login', icon: 'home' },
    { title: 'Pricing', url: '/page/pricing', icon: 'pricetag' },
    { title: 'Contact us', url: '/page/contact-us', icon: 'call' },
    { title: 'Login', url: '/login', icon: 'log-in' },
    { title: 'Sign Up', url: '/signup/step1', icon: 'add-circle' },
    { title: 'Blog', url: '/blog', icon: 'book' },
    { title: 'FAQs', url: '/page/faqs', icon: 'help' },
    { title: 'Jail News', url: '/page/jail-news', icon: 'newspaper' },
    { title: 'Billing Calculator', url: '/page/billing-calculator', icon: 'calculator' },
    { title: 'Correctional Centers', url: 'page/correcttional', icon: 'file-tray' },
  ];
  //public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];

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
      sub_title:'',
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
      sub_title:'',
      submenu: [ 
        { title: 'Setup Auto Pay', url: '/user/auto-recharge', icon: 'logo-usd'},
        { title: 'Update Credit Card info', url: '/user/credit-card', icon: 'logo-usd'},
        { title: 'Payment History', url: '/user/order', icon: 'logo-usd'}
      ] 
    },
    {
      title:'Billing Information', 
      sub_title:'',
      submenu: [ 
        { title: 'Order History', url: '/user/order', icon: 'logo-usd'},
        { title: 'Referral Code', url: '/user/referral', icon: 'logo-usd'}
      ] 
    },
    {
      title:'Call Log', 
      sub_title:'',
      submenu: [ 
        { title: 'VIEW MONTHLY CALL LOG', url: '/user/call-time', icon: 'logo-usd'}
      ] 
    }
  ];

  
  constructor(
    private router: Router, 
    private storage: Storage, 
    private apphttp: AppHttpService,
    private auth: AuthService,
    private platform: Platform,
    @Optional() private routerOutlet?: IonRouterOutlet
    ) {
      this.platform.backButton.subscribeWithPriority(-1, () => {
        if (!this.routerOutlet.canGoBack()) {
          App.exitApp();
        }
      });
    // this.storage.create();
    // this.storage.get('user_id').then((val)=>{
    //   this.user_id = val;
    // });
  }

  ngOnDestroy() {
    if(this.userSub) {
      this.userSub.unsubscribe();
    }
  }

  

  async ngOnInit() {
    // // Hide the splash (you should do this on app launch)
    // await SplashScreen.hide();

    // // Show the splash for an indefinite amount of time:
    // await SplashScreen.show({
    //   autoHide: false,
    // });

    // Show the splash for two seconds and then automatically hide it:
    // await SplashScreen.show({
    //   showDuration: 2000,
    //   autoHide: true,
    // });

    this.userSub = this.auth.getUserInfo().subscribe(val=>{
      if(val!==null) {
        this.user_id = val;
        this.apphttp.get(`dashboard/${val}`).subscribe({
          next: (result) => {
            console.log(result);
            this.responseData = result;
          }, error: (err) => {
            console.log(err);
          }
        });
      } else {
        this.user_id = null;
      }
    });
    // this.userSub = this.auth.user$.subscribe(val=>{
    //   this.user_id = val;
    // });

    this.storage.create();
    this.storage.get('user_id').then((val)=>{
      console.log( `App Component - ${val}` );
      this.user_id = val;
      console.log( `App Component user_id - ${this.user_id}` );
    });

    this.storage.get('user_id').then((val) => {
      if(val!=null) {
        this.user_id = val;
        this.apphttp.get(`dashboard/${val}`).subscribe({
          next: (result) => {
            this.responseData = result;
          }, error: (err) => {
            console.log(err);
          }
        });
      }
    });

    this.storage.get('account_id').then((val) => {
      if(val!=null) {
        this.account_id = val;
      }
    });

  }

  home() {
    this.router.navigate(['/user/dashboard']);
  }

  logout() {
    this.storage.clear();
    this.user_id = null;
    this.responseData = null;
    //this.events.publish('user:loggedout');  
    //this.events.publish('tab:loggedout');      
    this.router.navigate(['/login']);
  }
}
