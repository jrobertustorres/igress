import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-modal-qrcode',
  templateUrl: 'modal-qrcode.html',
})
export class ModalQrcodePage {

  constructor(public navCtrl: NavController, 
              public viewCtrl: ViewController,
              public navParams: NavParams) {
  }

  ngOnInit() {
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }

}
