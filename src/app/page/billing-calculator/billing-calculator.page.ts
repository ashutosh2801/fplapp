import { Component, OnInit, ViewChild, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { AlertController, ModalController, NavParams, LoadingController, IonContent } from '@ionic/angular';
//import { DatePickerDirective } from 'ion-datepicker';
//import { DatePipe } from '@angular/common';
import { AppHttpService } from 'src/app/services/app-http.service';

@Component({
  selector: 'app-billing-calculator',
  templateUrl: './billing-calculator.page.html',
  styleUrls: ['./billing-calculator.page.scss'],
})
export class BillingCalculatorPage implements OnInit {

  logo: string = environment.logo;
  @ViewChild(IonContent) content: IonContent;
  //@ViewChild(DatePickerDirective) public datepicker: DatePickerDirective;
  @Output() datetimeChanged: EventEmitter<string> = new EventEmitter();

  public localDate: Date = new Date();  
  public min: Date = new Date();
  public initDate: string;
  public date: Date = new Date();  
  registerData : FormGroup;
  formData : any;
  topup_div = 0;
  response: any = {};
  fee: number;
  x1: number;
  topup: number;
  price_per: number;
  tot: number;
  price: number;
  price_per2: number;
  tot2: number;
  province: number;
  package1 : number;
  //date: Date;
  myBool: string = 'submit-btn';
  _call_type = 'Collect Call';

  packages = [
    /*{"id":"161", "name":"Collect Call - Monthly ($1.50/call + $0.00/min.)"},
    {"id":"162", "name":"Collect Call - Monthly ($2.00/call + $0.00/min.)"},
    {"id":"163", "name":"Collect Call - P-A-Y-G ($1.50/call + $0.07/min.)"},
    {"id":"164", "name":"Collect Call - P-A-Y-G ($2.00/call + $0.07/min.)"}*/
  ];
  datetime: any;

  constructor( 
    //public datepipe: DatePipe, 
    private fb: FormBuilder, 
    private apphttp: AppHttpService, 
    private alertCtrl: AlertController, 
    public modal: ModalController, 
    public loadingCtrl: LoadingController ) 
    {
      this.min.setDate(this.min.getDate());
      //this.initDate = this.min | date: 'yyyy-MM-dd';
      this.initDate = this.min.getFullYear()+'-'+(this.min.getMonth()+1)+"-"+(this.min.getDate());
      console.log(this.initDate);
  }
  
  formErrors = {
    'call_type': '',
    'package_cat': '',
    'package': '',
    'topup': '',
    'province': '',
    'datepicker':''
  };
  
  validationMessages = {
    'call_type': { 'required': 'Call type is required.' },
    'package_cat': { 'required': 'Package category is required.' },
    'package': { 'required': 'Package is required.' },
    'topup': { 'required': 'Topup is required.' },
    'province': { 'required': 'Province is required.' },
    'datepicker': { 'required': 'Date is required.' }
  };

  ngOnInit() {
    this.registerData = this.fb.group({
      'call_type': ['', Validators.required],
      'package_cat': ['', Validators.required],
      'package':['', Validators.required],
      'topup':[''],
      'province':['', Validators.required],
      //'datepicker':['', Validators.required],      
      'actfeetot':[''],
      'price':[''],
      'connect_fee':[''],
      'minute_fee':[''],
      'activation_fee':[''],
      'fee':['']
    });

    this.registerData.valueChanges.subscribe((data)=>{
      this.logValidationErrors(this.registerData);
    })
  }  

  onClick(e: any) {
    const val = e.target.value;
    console.log(val);
    this._call_type = val;
  }

  package_cat(value: any) {
    //console.log(val);
    const val = value.target.value;
    let data: any;
    if(val=='Collect Call + IONQC' || val=='Collect Call + OONQC')
    { this.topup_div = 1; }
    else
    { this.topup_div = 0; }

    if(val=='Collect Call + IONQC') {
      data = {'location':'IONQC', 'call_type':'Collect Call'};
    }
    else if(val=='Collect Call + OONQC') {
      data = {'location':'OONQC', 'call_type':'Collect Call'};
    }
    else if(val=='Calling Card + IONQC') {
      data = {'location':'IONQC', 'call_type':'Calling Card'};
    }
    else if(val=='Calling Card + OONQC') {
      data = {'location':'OONQC', 'call_type':'Calling Card'};
    }
    console.log(data);
    this.presentLoading();
    this.apphttp.post('get_package', data).subscribe({
      next: (result) => { 
        console.log(result);      
        let res:any = result;
        this.packages = res;  
        this.loadingCtrl.dismiss(); 
      }, error: (err) => {
        // Error log
        console.log(err);     
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

  package(value: any) {
    const val = value.target.value;
    let data: any;
    data = {'id':val};
    this.apphttp.post('get_package_prices', data).subscribe({
      next: (result) => {
        this.response = result;     
        this.registerData.get('price').setValue( result.price ); 
        this.registerData.get('connect_fee').setValue( result.connect_fee ); 
        this.registerData.get('minute_fee').setValue( result.minute_fee ); 
        this.registerData.get('activation_fee').setValue( result.activation_fee ); 
        this.registerData.get('fee').setValue( result.fee ); 
        console.log(this.response);  
      }, error: (err) => {
        // Error log
        console.log(err);     
      }
    });
  } 
  
  setDate(val: any) {
    const event = val.target.value;
    //console.log(event);
    this.date = new Date(event);
    this.localDate = new Date(event);
    //this.initDate = event;
    let s2 = event.split("T");   
    this.initDate = s2[0];
    console.log(this.initDate);
    //this.initDate = this.datepipe.transform(this.date, 'yyyy-MM-dd');
  }

  
  
  calculator(formData: any) {
    console.log(formData);
    this.myBool = 'submit-btn2';


    console.log( 'price - ',formData.province);

    this.price   		= Number( formData.price );
    this.province  	= Number( this.province_percent(formData.province) ); 
    this.fee     		= Number( formData.fee );
    this.topup    	= Number( formData.topup );
    this.package1   = Number( formData.package );
    let package_cat = ( formData.package_cat );

    console.log( 'price - ',this.price );
    console.log( 'Province - ',this.province );
    console.log( 'fee - ',this.fee );
    console.log( 'topup - ',this.topup );
    console.log( 'package1 - ',this.package1 );
    //console.log( 'package_cat - ',this.package_cat );
    
    if(this.package1==null) {	
      return false;
    } 
    else if(this.initDate==null) {
      //alert('Please select activation date!');
      return false;
    }
    else {
      
      let s1 = this.initDate;
      let s = s1.split("-");      

      let d = Number(s[2]); 
      let m = Number(s[1]); 
      let y = Number(s[0]);

      if(package_cat == 'Collect Call + IONQC' || package_cat == 'Collect Call + OONQC') {
        if(this.topup==null) {
          this.topup = 0;
          return false;
        }
        else {
          this.tot = this.topup;
          //this.topup = 0;
        }
      }

      let tm = 0;
            
      if(m==1 || m==3 || m==5 || m==7 || m==8 || m==10 || m==12) { tm = 31; }
      else if(m==4 || m==6 || m==9 || m==11) { tm = 30; }
      else if(m==2) { tm = (y%4==0) ? 29 : 28;} 
        
      //Total Number of day of Month - (selected day - 1) = Total day 
      let ftd = (tm-d);
      //console.log('ftd='+this.ftd);
      //Package Price / Total day = One day price 
      let ftm = (this.price/tm); 
      //console.log('ftm='+ftm);
      //Total day * One day price = Prorated Price without tax 
      this.x1  = (ftd * ftm);
      //console.log('x1='+x1);
      this.tot = this.tot + this.fee + this.x1;
      this.price_per = (this.tot * this.province)/100;
      //console.log('province='+province);
      //console.log('price_per='+price_per);
      this.tot = this.tot + this.price_per;
      console.log('tot='+this.tot);
      this.price_per2 = (this.price*this.province)/100;
      this.tot2 = this.price + this.price_per2;
      console.log('tot='+this.tot2);

      let yOffset = document.getElementById('yourTodayItemId').offsetTop;
      this.content.scrollToPoint(0, yOffset, 2000)
    }
  }

  province_percent(expression: string) {
    switch (expression) {
      case 'Alberta':
      return 5;
      case 'Northwest Territories':
      return 5;
      case 'Nunavut':
      return 5;
      case 'Yukon Territory':
      return 5;

      case 'Saskatchewan':
      return 11;

      case 'British Columbia':
      return 12;

      case 'Manitoba':
      return 13;
      case 'Ontario':
      return 13;

      case 'Québec':
      return 14.975;    

      case 'New Brunswick':
      return 15;    
      case 'Nova Scotia':
      return 15;    
      case 'Prince Edward Island':
      return 15;    
      case 'Newfoundland and Labrador':
      return 15;    
    }
  }

  async showPopup(title: string, text: string) {
    const alert = await this.alertCtrl.create({
      header: title,
      subHeader: text,
      buttons: [
        {
          text: 'OK',
          handler: data => {     }
        }
      ]
    });
    await alert.present();
  }

  logValidationErrors(group: FormGroup = this.registerData): void {
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);
      this.tot = 0 ;
      this.tot2 = 0 ;
      if (abstractControl instanceof FormGroup) {
        this.logValidationErrors(abstractControl);
      } else {
        this.formErrors[key] = '';
        if (abstractControl && !abstractControl.valid && (abstractControl.touched || abstractControl.dirty)) {
          const messages = this.validationMessages[key];
          for (const errorKey in abstractControl.errors) {
            if (errorKey) {
              this.formErrors[key] += messages[errorKey] + ' ';
              
            }
          }
        }
      }
    });
  }

}
