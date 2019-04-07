import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalEntrarCadastrarPage } from './modal-entrar-cadastrar';

@NgModule({
  declarations: [
    ModalEntrarCadastrarPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalEntrarCadastrarPage),
  ],
})
export class ModalEntrarCadastrarPageModule {}
