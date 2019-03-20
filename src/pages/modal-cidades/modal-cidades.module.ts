import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalCidadesPage } from './modal-cidades';

@NgModule({
  declarations: [
    ModalCidadesPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalCidadesPage),
  ],
})
export class ModalCidadesPageModule {}
