import { Events, NavController } from 'ionic-angular';
import { Component } from '@angular/core';
import { Constants } from '../../app/constants';

import { HomePage } from '../home/home';
import { FavoritosListPage } from '../favoritos-list/favoritos-list';
import { PerfilPage } from '../perfil/perfil';
import { EditarPerfilPage } from '../editar-perfil/editar-perfil';
import { MeusIngressosListPage } from '../meus-ingressos-list/meus-ingressos-list';
import { AnuncioRevendaListPage } from '../anuncio-revenda-list/anuncio-revenda-list';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  private showionTab: boolean = true;
  public idUsuarioLogado: string;

  tab1Root = HomePage;
  tab2Root = FavoritosListPage;
  tab3Root = PerfilPage;
  tab4Root = EditarPerfilPage;
  tab6Root = AnuncioRevendaListPage;

  constructor(public events: Events,
              public navCtrl: NavController) {
  }

  ngOnInit() {
    this.idUsuarioLogado = localStorage.getItem(Constants.ID_USUARIO);
    
    this.events.subscribe('showButtonEvent:change', (showButton) => {
      this.showionTab = showButton;

    });

    this.events.subscribe('usuarioLogadoEvent:change', (usuarioLogado) => {
      this.idUsuarioLogado = usuarioLogado;
    });
  }

  openMeusIngressosList() {
    if(this.idUsuarioLogado) {
      this.navCtrl.push(MeusIngressosListPage, { animate: true, direction: 'back' });
    }

  }

}
