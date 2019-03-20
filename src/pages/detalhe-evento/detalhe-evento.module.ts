import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DetalheEventoPage } from './detalhe-evento';

@NgModule({
  declarations: [
    DetalheEventoPage,
  ],
  imports: [
    IonicPageModule.forChild(DetalheEventoPage),
  ],
})
export class DetalheEventoPageModule {}
