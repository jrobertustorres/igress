import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MeusIngressosListPage } from './meus-ingressos-list';

@NgModule({
  declarations: [
    MeusIngressosListPage,
  ],
  imports: [
    IonicPageModule.forChild(MeusIngressosListPage),
  ],
})
export class MeusIngressosListPageModule {}
