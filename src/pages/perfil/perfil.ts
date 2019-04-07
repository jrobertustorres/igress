import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

//PAGES
import { LoginPage } from '../../pages/login/login';
import { MeusDadosPage } from '../../pages/meus-dados/meus-dados';

@IonicPage()
@Component({
  selector: 'page-perfil',
  templateUrl: 'perfil.html',
})
export class PerfilPage {

  constructor(public navCtrl: NavController, 
              public navParams: NavParams) {
  }

  ngOnInit() {}

  openLoginPage() {
    this.navCtrl.push(LoginPage);
  }

  openMeusDadosPage() {
    this.navCtrl.push(MeusDadosPage);
  }

  openModalTermos(){
    window.open('http://www.petpratico.com.br/termos-de-uso-1_0.html', '_system', 'location=yes');
  }

  openModalPolitica(){
    window.open('http://www.petpratico.com.br/politica-de-privacidade-1_0.html', '_system', 'location=yes');
  }

}
