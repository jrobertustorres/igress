import { Component } from '@angular/core';
import { Platform, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Device } from '@ionic-native/device';
import { AppVersion } from '@ionic-native/app-version';
import { Network } from '@ionic-native/network';
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
              private network: Network,
              public alertCtrl: AlertController,
              splashScreen: SplashScreen) {
    platform.ready().then(() => {
      this.checkNetwork();
      // abaixo verificamos se a intenet cair depois que o cliente já entrou no app
      this.network.onDisconnect().subscribe(() => {
        this.checkNetwork();
      });
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

  checkNetwork() {
    if(this.network.type === 'none' || this.network.type === 'unknown') {
      localStorage.setItem(Constants.MODO_OFF_LINE, 'ON');
      let alert = this.alertCtrl.create({
      title: 'Você está offline',
      subTitle: 'Você está offline mas pode acessar seus ingressos normalmente',
      buttons: [{
        text: 'Ok',
        handler: () => {
            }
        }]
      });
    alert.present();
    } else {
      localStorage.setItem(Constants.MODO_OFF_LINE, 'OFF');
    }

  }

}
