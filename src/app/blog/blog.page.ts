import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AppHttpService } from '../services/app-http.service';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.page.html',
  styleUrls: ['./blog.page.scss'],
})
export class BlogPage implements OnInit {

  logo: string = environment.logo;
  Posts: any = [];
  slug: string; 
  postCount = null;
  page = 1;

  constructor( 
    private apphttp: AppHttpService, 
    private router: Router, 
    private loadingCtrl: LoadingController) {    
      this.blogs();    
  }

  async presentLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Please wait...',
      duration: 2000,
      spinner: 'bubbles',
      id:'loading'
    });
    await loading.present();
  }

  blogs() {
    this.presentLoading();

    this.apphttp.getAllPosts().subscribe({
      next: (data:any) => {
        console.log(data);
        this.postCount = this.apphttp.allPosts;
        this.Posts = data.model;
        this.loadingCtrl.dismiss('loading'); 
      }
    });

    // this.apphttp.get('blog').subscribe({
    //   next: (result) => {
    //     let response:any = result;
    //     this.items = response.model;
    //     //console.log(result);
    //     this.loadingCtrl.dismiss(); 
    //   }, error: (err) => {
    //     console.log(err);
    //   }
    // });   
  }

  infiniteLoad(e: any) {
    this.page++;
 
    this.apphttp.getAllPosts(this.page).subscribe({
      next: (data: any) => {
        console.log(data);
        if(data) {
          this.Posts = [...this.Posts, ...data.model];
          e.target.complete();
        }
  
        // Disable loading when reached last
        if (this.page == this.apphttp.pages) {
          e.target.disabled = true;
        }
      }
    });
  }

  getItems(ev: any) {
    var val = ev.target.value;
    if (val && val.trim() != '') {
      this.Posts = this.Posts.filter((item) => { 
        return ((item.title.toLowerCase().indexOf(val.toLowerCase()) > -1) || (item.phone.toLowerCase().indexOf(val.toLowerCase()) > -1));
      })
    }
  } 

  ngOnInit() {
  }

}
