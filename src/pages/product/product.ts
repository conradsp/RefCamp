import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';

/*
  Generated class for the Product page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-product',
  templateUrl: 'product.html'
})
export class ProductPage {

  prodId = null;
  currProduct = { };

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http) {}

  ionViewDidLoad() {
    //console.log('ionViewDidLoad ProductPage');
    this.prodId = this.navParams.data.id;
    this.getProduct(this.prodId).then((result) => {
      this.currProduct = result;
    });
  }

  getProduct(prodID) {
    return new Promise((resolve, reject) => {
      this.http.get('https://refcampweb.herokuapp.com/api/products/'+prodID)
        .subscribe(res => {
          //let data = res.json();
          resolve(res.json());
        }, (err) => {
          reject(err);
        });
    });
  }
}
