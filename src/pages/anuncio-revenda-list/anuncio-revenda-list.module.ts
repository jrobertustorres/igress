import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AnuncioRevendaListPage } from './anuncio-revenda-list';

@NgModule({
  declarations: [
    AnuncioRevendaListPage,
  ],
  imports: [
    IonicPageModule.forChild(AnuncioRevendaListPage),
  ],
})
export class AnuncioRevendaListPageModule {}
