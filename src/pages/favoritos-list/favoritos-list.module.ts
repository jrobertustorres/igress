import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FavoritosListPage } from './favoritos-list';

@NgModule({
  declarations: [
    FavoritosListPage,
  ],
  imports: [
    IonicPageModule.forChild(FavoritosListPage),
  ],
})
export class FavoritosListPageModule {}
