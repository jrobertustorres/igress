import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Events } from 'ionic-angular';
import { Constants } from '../../app/constants';

//PAGES
import { MeusDadosPage } from '../meus-dados/meus-dados';
import { MinhaSenhaPage } from '../minha-senha/minha-senha';

@IonicPage()
@Component({
  selector: 'page-editar-perfil',
  templateUrl: 'editar-perfil.html',
})
export class EditarPerfilPage {
  public idUsuarioLogado: string;
  public nomeUsuarioLogado: string;
  public emailUsuario: string;
  public versaoApp: string;

  constructor(public navCtrl: NavController, 
              public alertCtrl: AlertController,
              public events: Events,
              public navParams: NavParams) {
  }

  ngOnInit() {
    this.versaoApp = localStorage.getItem(Constants.VERSION_NUMBER);

    this.events.subscribe('atualizaNomeEvent:change', (nomePessoa) => {
      let names = nomePessoa.split(" ");
      this.nomeUsuarioLogado = names[0] +' '+ names[1];
      localStorage.setItem(Constants.NOME_PESSOA, this.nomeUsuarioLogado);
    });
    this.idUsuarioLogado = localStorage.getItem(Constants.ID_USUARIO);
    this.nomeUsuarioLogado = localStorage.getItem(Constants.NOME_PESSOA);
    this.emailUsuario = localStorage.getItem(Constants.EMAIL_PESSOA);

  }

  openMeusDadosPage() {
    this.navCtrl.push(MeusDadosPage);
  }

  openMinhaSenhaPage() {
    this.navCtrl.push(MinhaSenhaPage);
  }

  openTermos(){
    window.open('http://www.petpratico.com.br/termos-de-uso-1_0.html', '_system', 'location=yes');
  }

  openPolitica(){
    window.open('http://www.petpratico.com.br/politica-de-privacidade-1_0.html', '_system', 'location=yes');
  }

  openPoliticaRevenda(){
    window.open('http://www.petpratico.com.br/politica-de-privacidade-1_0.html', '_system', 'location=yes');
  }

  logOut() {
    let alert = this.alertCtrl.create({
      subTitle: 'Deseja realmente sair?',
      buttons: [
        {
          text: 'Ficar',
          role: 'cancel'
        },
        {
          text: 'Sair',
          handler: () => {
            localStorage.removeItem(Constants.ID_USUARIO);
            localStorage.removeItem(Constants.TOKEN_USUARIO);
            localStorage.removeItem(Constants.NOME_PESSOA);
            // localStorage.removeItem(Constants.QTD_ITENS_CARRINHO);
            // localStorage.removeItem(Constants.CIDADES_POR_ESTADO);
            // localStorage.removeItem(Constants.IS_CADASTRO_COMPLETO);
            // localStorage.removeItem(Constants.IS_CADASTRO_ENDERECO_COMPLETO);
            // localStorage.removeItem(Constants.ESTADO_TEMA);
            // this.events.publish('atualizaBadgeCarrinhoLogoutEvent:change', localStorage.getItem(Constants.QTD_ITENS_CARRINHO));
            this.events.publish('usuarioLogadoEvent:change', localStorage.getItem(Constants.ID_USUARIO));
            // this.navCtrl.parent.select(0);
          }
        }
      ]
    });
    alert.present();
  }

}
