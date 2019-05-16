import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

@IonicPage()
@Component({
  selector: 'page-modal-qrcode',
  templateUrl: 'modal-qrcode.html',
})
export class ModalQrcodePage {
  private tokenIngresso: any;

  constructor(public navCtrl: NavController, 
              public viewCtrl: ViewController,
              private barcodeScanner: BarcodeScanner,
              public navParams: NavParams) {
    this.tokenIngresso = navParams.get("tokenIngresso");
    
  }

  ngOnInit() {
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }

}
