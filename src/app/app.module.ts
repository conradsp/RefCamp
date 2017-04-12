import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { IonicStorageModule } from '@ionic/storage';
import { TabsPage } from '../pages/tabs/tabs';
import { HomePage } from '../pages/home/home';
import { SettingsPage } from '../pages/settings/settings';
import { SellPage } from '../pages/sell/sell';
import { LoginPage } from '../pages/login-page/login-page';
import { RegisterPage } from '../pages/register-page/register-page';
import { ProductPage } from '../pages/product/product';
import { AuthModule } from '../providers/auth.module';
import { CloudSettings, CloudModule } from '@ionic/cloud-angular';

const cloudSettings: CloudSettings = {
  'core': {
    'app_id': '197ab640e61c5f43fd32c552c1c768e3cd8044b72cc6da8c'
  }
};

@NgModule({
  declarations: [
    MyApp,
    TabsPage,
    HomePage,
    SettingsPage,
    SellPage,
    LoginPage,
    RegisterPage,
    ProductPage
  ],
  imports: [
    IonicModule.forRoot(MyApp, {tabsPlacement: 'bottom'}),
    IonicStorageModule.forRoot(),
    CloudModule.forRoot(cloudSettings)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TabsPage,
    HomePage,
    SettingsPage,
    SellPage,
    LoginPage,
    RegisterPage,
    ProductPage
  ],
  providers: [AuthModule, {provide: ErrorHandler, useClass: IonicErrorHandler}
    ]
})
export class AppModule {}
