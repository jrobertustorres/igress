import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalQrcodePage } from './modal-qrcode';

@NgModule({
  declarations: [
    ModalQrcodePage,
  ],
  imports: [
    IonicPageModule.forChild(ModalQrcodePage),
  ],
})
export class ModalQrcodePageModule {}
