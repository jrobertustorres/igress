import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Device } from '@ionic-native/device/ngx';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { Constants } from '../app/constants';

import { TabsPage } from '../pages/tabs/tabs';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = TabsPage;

  constructor(public platform: Platform, 
              statusBar: StatusBar, 
              private device: Device,
              private appVersion: AppVersion,
              splashScreen: SplashScreen) {
    platform.ready().then(() => {
      if (this.platform.is('cordova')) {
        localStorage.setItem(Constants.UUID, this.device.uuid);
        this.appVersion.getVersionNumber().then((version) => {
          localStorage.setItem(Constants.VERSION_NUMBER, version);
        })
      }
      // para testes no browser
      else {
        localStorage.setItem(Constants.VERSION_NUMBER, '0.0.1');
      }
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}
