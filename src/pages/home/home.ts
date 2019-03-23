import { Component } from '@angular/core';
import { NavController, AlertController, Platform, LoadingController } from 'ionic-angular';
import { Constants } from '../../app/constants';
import { Device } from '@ionic-native/device/ngx';
import { DomSanitizer } from '@angular/platform-browser';

//ENTITYS
import { UsuarioEntity } from '../../model/usuario-entity';
import { VersaoAppEntity } from '../../model/versao-app-entity';
import { EventoListEntity } from '../../model/evento-list-entity';

//SERVICES
import { EventoService } from '../../providers/evento-service';
import { LoginService } from '../../providers/login-service';
import { VersaoAppService } from '../../providers/versao-app-service';

//PAGES
import { DetalheEventoPage } from '../detalhe-evento/detalhe-evento';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  private loading = null;
  segment: string = "destaquesList"; // default button
  private versaoAppEntity: VersaoAppEntity;
  private eventoListEntity: EventoListEntity;
  private usuarioEntity: UsuarioEntity;
  private versao: any;
  private dadosUsuario: any;
  private dadosEvento: any;
  private idUsuarioLogado: string;
  
  private errorConnection: string;

  constructor(public navCtrl: NavController,
    private versaoAppService: VersaoAppService,
              public platform: Platform,
              private loginService: LoginService,
              private eventoService: EventoService,
              private device: Device,
              public loadingCtrl: LoadingController,
              private sanitizer: DomSanitizer,
              public alertCtrl: AlertController) {
    this.usuarioEntity = new UsuarioEntity();
    this.versaoAppEntity = new VersaoAppEntity();
    this.eventoListEntity = new EventoListEntity();
  }
  
  ionViewWillEnter() {
    this.dadosEvento = null;
    this.idUsuarioLogado = localStorage.getItem(Constants.ID_USUARIO);
    this.getAtualizacaoStatus();
  }

  getAtualizacaoStatus() {
    try {

      // this.loading = this.loadingCtrl.create({
      //   content: "Aguarde...",
      // });
      // this.loading.present();

      // PARA TESTES NO BROWSER
      if(this.platform.is('mobileweb')) {
        this.versaoAppEntity.versao = "0.0.1"; // so para testes
        this.versaoAppEntity.sistemaOperacional = "ANDROID"; // so para testes
      } else { // para uso no smartphone
        this.versaoAppEntity.versao = localStorage.getItem(Constants.VERSION_NUMBER);
        this.versaoAppEntity.sistemaOperacional = this.device.platform;
      }

      this.versaoAppService.versaoApp(this.versaoAppEntity)
      .then((versaoResult: VersaoAppEntity) => {
        this.versao = versaoResult;

        if(this.versao.descontinuado == true) {
          this.showAlertVersao(this.versao);
        } else {
          this.verificaIdUsuario();
        }

      }, (err) => {
        // this.errorConnection = err.message ? err.message : 'Não foi possível conectar ao servidor';
        // this.dadosEvento = [];
        this.loading.dismiss();
        err.message = err.message ? err.message : 'Não foi possível conectar ao servidor';
        this.alertCtrl.create({
          subTitle: err.message,
          buttons: ['OK']
        }).present();
      });

    }catch (err){
      if(err instanceof RangeError){
      }
      console.log(err);
    }
  }

  verificaIdUsuario() {

    if(!this.idUsuarioLogado){
      this.findEventosDestaqueAndCidade();
      // this.loading.dismiss();
    }
    else if(this.idUsuarioLogado) {
      this.findUsuarioLogado();
    }
  }

  findUsuarioLogado() {
    try {

      this.usuarioEntity.idUsuario = parseInt(localStorage.getItem(Constants.ID_USUARIO));
      this.loginService.loginByIdService(this.usuarioEntity)
      .then((loginResult: UsuarioEntity) => {
        this.dadosUsuario = loginResult;
        this.findEventosDestaqueAndCidade();
        // this.loading.dismiss();
      }, (err) => {
        this.errorConnection = err.message ? err.message : 'Não foi possível conectar ao servidor';
        this.dadosEvento = [];
        // this.loading.dismiss();
        // err.message = err.message ? err.message : 'Não foi possível conectar ao servidor';
        // this.alertCtrl.create({
        //   subTitle: err.message,
        //   buttons: ['OK']
        // }).present();
      });

    }catch (err){
      if(err instanceof RangeError){
      }
      console.log(err);
    }
  }

  findEventosDestaqueAndCidade() {
    try {

      this.eventoService.findEventosDestaqueAndCidade()
      .then((eventoResult: EventoListEntity) => {
        this.dadosEvento = eventoResult;

        // this.loading.dismiss();
      }, (err) => {
        // this.loading.dismiss();
        // err.message = err.message ? err.message : 'Não foi possível conectar ao servidor';
        this.errorConnection = err.message ? err.message : 'Não foi possível conectar ao servidor';
        this.dadosEvento = [];
        // this.alertCtrl.create({
        //   subTitle: err.message,
        //   buttons: ['OK']
        // }).present();
      });

    }catch (err){
      if(err instanceof RangeError){
      }
      console.log(err);
    }
  }

  showAlertVersao(versao) {
    const alert = this.alertCtrl.create({
      title: "Atualização do aplicativo",
      subTitle: "A versão que você está usando foi descontinuada. É necessário atualizar para continuar usando o App.",
      buttons: [
        {
        text: 'OK',
          handler: () => {
            this.getPlatform(versao);
          }
      }]
    });
    alert.present();
  }

  getPlatform(versao) {
    if (this.platform.is('ios')) {
      window.open(versao.linkIos, '_system', 'location=yes');
      this.platform.exitApp();
    }

    if (this.platform.is('android')) {
      window.open(versao.linkAndroid, '_system', 'location=yes');
      this.platform.exitApp();
    }
  }

  openSearchEventoPage() {
    // this.navCtrl.push(ModalBuscaProdutosPage);
  }
  
  openDetalheEventoPage(idEvento: any) {
    this.navCtrl.push(DetalheEventoPage, {
      idEvento: idEvento
    })
  }

}
