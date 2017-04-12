import { Component } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { NavController } from 'ionic-angular';
import { ProductPage } from '../../pages/product/product';

import { AuthModule } from '../../providers/auth.module';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  currUser = { };
  categories = [{name: 'Food', items: [] }, {name: 'Livestock', items: [] }, {name: 'Machinery', items: [] }, {name: 'Services', items: [] }];
  currCat;
  currSearch = '';

  constructor(public navCtrl: NavController, public authService: AuthModule, public http: Http) {
    var that = this;
    this.getProducts().then((result) => {
      let products = result as Array<any>;
      for (let product of products) {
        switch(product.category) {
          case 'Food': {
            that.categories[0].items.push(product);
            break;
          }
          case 'Livestock': {
            that.categories[1].items.push(product);
            break;
          }
          case 'Machinery': {
            that.categories[2].items.push(product);
            break;
          }
          case 'Services': {
            that.categories[3].items.push(product);
            break;
          }
        }
      }
    });

    this.authService.checkAuthentication().then((result) => {
      that.currUser = that.authService.user;

    });
  }

  ionViewDidLoad() {
    var that = this;
    this.getProducts().then((result) => {
      let products = result as Array<any>;
      for (let product of products) {
        switch(product.category) {
          case 'Food': {
            that.categories[0].items.push(product);
            break;
          }
          case 'Livestock': {
            that.categories[1].items.push(product);
            break;
          }
          case 'Machinery': {
            that.categories[2].items.push(product);
            break;
          }
          case 'Services': {
            that.categories[3].items.push(product);
            break;
          }
        }
      }
    });
  }

  getProducts() {
    return new Promise((resolve, reject) => {
      this.http.get('https://refcampweb.herokuapp.com/api/products/')
        .subscribe(res => {
          //let data = res.json();
          resolve(res.json());
        }, (err) => {
          reject(err);
        });
    });
  }

  viewProduct(product) {
    this.navCtrl.push(ProductPage, {id: product._id});
  }

  onSearchInput(event) {
    console.log(this.currSearch);
  }

  onSearchCancel(event) {

  }

  toggleCategory(cat) {
    if (this.isCatShown(cat)) {
      this.currCat = null;
    } else {
      this.currCat = cat;
    }
  };
  isCatShown(cat) {
    return this.currCat === cat;
  };
}
