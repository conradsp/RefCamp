import { NgModule } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { AuthHttp, AuthConfig } from 'angular2-jwt';
import {JwtHelper} from 'angular2-jwt';
import {tokenNotExpired} from 'angular2-jwt';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';

let storage = new Storage();

class _User {
  _id: string = '';
  name: string = '';
  email: string = '';
  role: string = '';
  $promise = undefined;
}

export function getAuthHttp(http) {
  return new AuthHttp(new AuthConfig({
    //headerPrefix: YOUR_HEADER_PREFIX,
    noJwtError: true,
    globalHeaders: [{'Accept': 'application/json'}],
    tokenName: 'token',
    tokenGetter: (() => storage.get('token')),
  }), http);
}
@NgModule({
  providers: [
    {
      provide: AuthHttp,
      useFactory: getAuthHttp,
      deps: [Http, RequestOptions]
    }
  ]
})
export class AuthModule {

  jwtHelper;
  user;
  authHttp;

  constructor(public http: Http) {
    this.authHttp = getAuthHttp(http);
    this.user = new _User();
    this.jwtHelper = new JwtHelper();

  }

  checkAuthentication() {
    var that = this;
    return new Promise((resolve, reject) => {
      storage.get('token').then(token => {
        if (tokenNotExpired(null, token)) {
          storage.get('currUser').then(currUser => {
            that.user = JSON.parse(currUser);
          });
          resolve(true);
        } else {
          reject(false);
        }
      });
    });
  }

  createAccount(details){

    return new Promise((resolve, reject) => {

      let headers = new Headers();
      headers.append('Content-Type', 'application/json');

      this.authHttp.post('https://refcampweb.herokuapp.com/api/auth/register', JSON.stringify(details), {headers: headers})
        .subscribe(res => {

          let data = res.json();
          storage.set('token', data.token);
          resolve(data);

        }, (err) => {
          reject(err);
        });

    });

  }

  login(credentials){

    return new Promise((resolve, reject) => {

      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      //headers.append('Access-Control-Allow-Origin', 'http://localhost:3000');
      var that = this;
      this.authHttp.post('https://refcampweb.herokuapp.com/auth/local', JSON.stringify(credentials), {headers: headers})
        .subscribe(res => {

          let data = res.json();
          storage.set('token', data.token);
          storage.set('currUser', JSON.stringify(data.user));
          that.user._id = that.jwtHelper.decodeToken(data.token)._id;
          that.user = data.user;

          resolve(res.json());
        }, (err) => {
          reject(err);
        });

    });

  }

  logout(){
    storage.set('token', '');
    storage.set('currUser', '');
  }
}
