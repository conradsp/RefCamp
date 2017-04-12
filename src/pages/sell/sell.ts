///<reference path="../../../node_modules/@angular/http/src/http.d.ts"/>
import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController, ToastController, Platform, LoadingController, Loading } from 'ionic-angular';
import { Camera } from 'ionic-native';
import { AuthModule } from '../../providers/auth.module';
import { Http, Headers, RequestOptions } from '@angular/http';

declare var cordova: any;

@Component({
  selector: 'page-sell',
  templateUrl: 'sell.html'
})
export class SellPage {
  loading: Loading;
  currUser = { username: null, _id: null };
  name;
  desc;
  category;
  filename: string = null;
  public base64Image: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public authService: AuthModule, public http: Http,
              public actionSheetCtrl: ActionSheetController, public toastCtrl: ToastController, public platform: Platform, public loadingCtrl: LoadingController) {

    var that = this;
    this.authService.checkAuthentication().then((result) => {
      that.currUser = that.authService.user;
    });

  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad SellPage');
  }

  public saveProduct() {
    let product = {
        seller: this.currUser.username,
        seller_id: this.currUser._id,
        name: this.name,
        desc: this.desc,
        category: this.category,
        photos: [ { filename: this.filename }]
      };
    return new Promise((resolve, reject) => {
      this.http.put('https://refcampweb.herokuapp.com/api/products/', product)
        .subscribe(res => {
          this.presentToast("Product Saved");
          resolve(res.json());
        }, (err) => {
          reject(err);
        });
    });
  }

  public presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select Image Source',
      buttons: [
        {
          text: 'Load from Library',
          handler: () => {
            this.takePicture(Camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: 'Use Camera',
          handler: () => {
            this.takePicture(Camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }

  public takePicture(sourceType) {
      var that = this;
      // Create options for the Camera Dialog
      var options = {
        quality: 50,
        targetWidth: 500,
        targetHeight: 500,
        sourceType: sourceType,
        destinationType: Camera.DestinationType.DATA_URL,
        saveToPhotoAlbum: false,
        correctOrientation: true
      };

      // Get the data of an image
      Camera.getPicture(options).then((imageData) => {
        // imageData is a base64 encoded string
        //that.base64Image = "data:image/jpeg;base64," + imageData;
        that.base64Image = this.base64toBlob(imageData, 'image/jpeg')
        let fileType = "image/jpeg";
        var newImageFilename = this.createFileName();

        var url = "https://refcampweb.herokuapp.com/api/photos/sign-s3/"+encodeURIComponent(newImageFilename)+"/"+encodeURIComponent(fileType);

        this.http.get(url)
          .subscribe(res => {
            let data = res.json();
            var uploadRequest = data.signedRequest;
            var uploadURL = data.url;
            let headers = new Headers({ 'Accept':'*/*', "Content-Type": "image/jpeg" });
            let options = new RequestOptions({ headers: headers });
            that.http.put(uploadRequest, that.base64Image, options).subscribe(res => {
              that.presentToast('Image succesfully uploaded.');
              that.filename = uploadURL;
            }, err => {
              alert(JSON.stringify(err));
            });
          }, err => {
            alert(JSON.stringify(err));
          });
      }, (err) => {
        alert(err);
      });

  }

  private base64toBlob(base64Data, contentType) {
    contentType = contentType || '';
    var sliceSize = 1024;
    var byteCharacters = atob(base64Data);
    var bytesLength = byteCharacters.length;
    var slicesCount = Math.ceil(bytesLength / sliceSize);
    var byteArrays = new Array(slicesCount);

    for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
      var begin = sliceIndex * sliceSize;
      var end = Math.min(begin + sliceSize, bytesLength);

      var bytes = new Array(end - begin);
      for (var offset = begin, i = 0 ; offset < end; ++i, ++offset) {
        bytes[i] = byteCharacters[offset].charCodeAt(0);
      }
      byteArrays[sliceIndex] = new Uint8Array(bytes);
    }
    return new Blob(byteArrays, { type: contentType });
  }

  // Create a new name for the image
  private createFileName() {
    var d = new Date(),
      n = d.getTime(),
      newFileName =  n + ".jpg";
    return newFileName;
  }

  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 5000,
      position: 'top'
    });
    toast.present();
  }


}
