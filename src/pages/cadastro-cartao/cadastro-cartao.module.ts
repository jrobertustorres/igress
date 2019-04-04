import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CadastroCartaoPage } from './cadastro-cartao';

@NgModule({
  declarations: [
    CadastroCartaoPage,
  ],
  imports: [
    IonicPageModule.forChild(CadastroCartaoPage),
  ],
})
export class CadastroCartaoPageModule {}
