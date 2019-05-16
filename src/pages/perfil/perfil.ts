import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Events } from 'ionic-angular';
import { Constants } from '../../app/constants';
import { Facebook } from '@ionic-native/facebook';

//PAGES
import { LoginPage } from '../../pages/login/login';
import { MeusDadosPage } from '../../pages/meus-dados/meus-dados';

//ENTITY
import { UsuarioEntity } from '../../model/usuario-entity';

//PROVIDER
import { LoginService } from '../../providers/login-service';

@IonicPage()
@Component({
  selector: 'page-perfil',
  templateUrl: 'perfil.html',
})
export class PerfilPage {
  private usuarioEntity: UsuarioEntity;
  isLoggedIn: boolean = false;
  users: any;

  constructor(public navCtrl: NavController, 
              public facebook: Facebook,
              private loginService: LoginService, 
              public alertCtrl: AlertController,
              public events: Events,
              public navParams: NavParams) {
    this.usuarioEntity = new UsuarioEntity();
    if(localStorage.getItem(Constants.ID_USUARIO)) {
      facebook.getLoginStatus()
      .then(res => {
        if(res.status === "connect") {
          this.isLoggedIn = true;
        } else {
          this.isLoggedIn = false;
        }
      })
      .catch(e => console.log(e));
    }
  }

  ngOnInit() {}

  doFbLogin(){
    this.facebook.login(['public_profile', 'email'])
    .then(res => {
      if(res.status === "connected") {
        this.isLoggedIn = true;
        this.getUserDetail(res.authResponse.userID);
      } else {
        this.isLoggedIn = false;
      }
    })
    .catch(e => console.log('Error logging into Facebook', e));
  }

  getUserDetail(userid: any) {
    this.facebook.api("/"+userid+"/?fields=id,email,name",["public_profile"])
      .then(res => {
        this.users = res;
        this.usuarioEntity.idUsuarioFacebook = this.users.id;
        this.usuarioEntity.nomePessoa = this.users.name;
        this.usuarioEntity.login = this.users.email;

      this.callLoginFacebookWS(this.usuarioEntity);
    })
    .catch(e => {
    });
  }

  callLoginFacebookWS(usuarioEntity: any) {
    
    this.loginService.loginFacebook(usuarioEntity)
    .then((usuarioEntityResult: UsuarioEntity) => {

      this.events.publish('showButtonEvent:change', true);

      // // se não fizer assim, a tela de login fica aberta sobre a tela de configurações
      // let currentIndex = this.navCtrl.getActive().index;
      // this.navCtrl.parent.select(0).then(() => {
      //     this.navCtrl.remove(currentIndex);
      // });

    }, (err) => {
      this.alertCtrl.create({
        subTitle: err.message,
        buttons: ['OK']
      }).present();
    });
  }

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
