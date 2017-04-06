import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { AuthModule } from '../../providers/auth.module';
import { HomePage } from '../home/home';

@Component({
  selector: 'register-page',
  templateUrl: 'register-page.html'
})
export class RegisterPage {

  role: string;
  email: string;
  password: string;
  loading: any;

  constructor(public navCtrl: NavController, public authService: AuthModule, public loadingCtrl: LoadingController) {

  }

  register(){

    this.showLoader();

    let details = {
      email: this.email,
      password: this.password,
      role: this.role
    };

    this.authService.createAccount(details).then((result) => {
      this.loading.dismiss();
      console.log(result);
      this.navCtrl.setRoot(HomePage);
    }, (err) => {
      this.loading.dismiss();
    });

  }

  showLoader(){

    this.loading = this.loadingCtrl.create({
      content: 'Authenticating...'
    });

    this.loading.present();

  }

}
