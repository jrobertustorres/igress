import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

//PAGES
import { LoginPage } from '../../pages/login/login';
import { MeusDadosPage } from '../../pages/meus-dados/meus-dados';

@IonicPage()
@Component({
  selector: 'page-modal-entrar-cadastrar',
  templateUrl: 'modal-entrar-cadastrar.html',
})
export class ModalEntrarCadastrarPage {

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public viewCtrl: ViewController,) {
  }

  ngOnInit() {}
  ionViewDidLoad() {}

  closeModal() {
    this.viewCtrl.dismiss();
  }

  doFbLogin() {
    
  }

  openLoginPage() {
    this.navCtrl.push(LoginPage);
  }

  openMeusDadosPage() {
    this.navCtrl.push(MeusDadosPage);
  }

}
