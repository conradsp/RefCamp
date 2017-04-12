import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';
import { SettingsPage } from '../settings/settings';
import { SellPage } from '../sell/sell';

@Component({
  templateUrl: 'tabs.html'
})

export class TabsPage {

  tab1Root: any = HomePage;
  tab2Root: any = SellPage;
  tab3Root: any = SettingsPage;

  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ionViewDidLoad() {
    //console.log('ionViewDidLoad TabsPage');
  }

}
