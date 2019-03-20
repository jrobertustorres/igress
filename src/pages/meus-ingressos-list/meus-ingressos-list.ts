import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

//PAGES
import { DetalheEventoPage } from '../detalhe-evento/detalhe-evento';

@IonicPage()
@Component({
  selector: 'page-meus-ingressos-list',
  templateUrl: 'meus-ingressos-list.html',
})
export class MeusIngressosListPage {

  constructor(public navCtrl: NavController, 
              public navParams: NavParams) {
  }

  ngOnInit() {
  }

  openDetalheEventoPage(idEvento: any, lastViewDetalhe: string) {
    // this.navCtrl.push(DetalheEventoPage);
    this.navCtrl.push(DetalheEventoPage, {
      lastViewDetalhe: lastViewDetalhe
      // idEvento: idEvento
    })
  }

}
