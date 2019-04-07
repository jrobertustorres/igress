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
    this.barcodeScanner.encode(this.barcodeScanner.Encode.TEXT_TYPE, this.tokenIngresso).then((encodedData) => {
      this.tokenIngresso = encodedData;
    }, (err) => {
        console.log("Error occured : " + err);
    });

    // this.barcodeScanner.scan().then(tokenIngresso => {
    //   console.log('Barcode data ', tokenIngresso);
    //   this.tokenIngresso = tokenIngresso;
    //   }).catch(err => {
    //       console.log('Error', err);
    //   });
  }

  ngOnInit() {
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }

}
