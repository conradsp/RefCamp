import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { AuthModule } from '../../providers/auth.module';
import { TabsPage } from '../tabs/tabs';
import { RegisterPage } from '../register-page/register-page';

@Component({
  selector: 'login-page',
  templateUrl: 'login-page.html'
})
export class LoginPage {

  username: string;
  password: string;
  loading: any;

  constructor(public navCtrl: NavController, public authService: AuthModule, public loadingCtrl: LoadingController) {

  }

  ionViewDidLoad() {

    this.showLoader();

    //Check if already authenticated
    this.authService.checkAuthentication().then((result)=> {
      //console.log("Already authorized");
      this.loading.dismiss();
      this.navCtrl.setRoot(TabsPage);
    }, (err) => {
      //console.log("Not already authorized");
      this.loading.dismiss();
    });

  }

  login(){

    this.showLoader();

    let credentials = {
      username: this.username,
      password: this.password
    };

    this.authService.login(credentials).then((result) => {
      this.loading.dismiss();
      //console.log(result);
      this.navCtrl.setRoot(TabsPage);
    }, (err) => {
      this.loading.dismiss();
      console.log(err);
    });

  }

  launchSignup(){
    this.navCtrl.push(LoginPage);
  }

  showLoader(){

    this.loading = this.loadingCtrl.create({
      content: 'Authenticating...'
    });

    this.loading.present();

  }

}
