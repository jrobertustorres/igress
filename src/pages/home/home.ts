import { Component } from '@angular/core';
import { NavController, AlertController, Platform, LoadingController } from 'ionic-angular';
import { Constants } from '../../app/constants';
import { Device } from '@ionic-native/device';
import { DomSanitizer } from '@angular/platform-browser';
import { Geolocation } from '@ionic-native/geolocation';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { Diagnostic } from '@ionic-native/diagnostic';

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
  private dadosEventosProximos: any;
  private listEventosProximos: any;
  private idUsuarioLogado: string;
  public showLoading: boolean = true;  
  private errorConnection: boolean = false;

  constructor(public navCtrl: NavController,
    private versaoAppService: VersaoAppService,
              public platform: Platform,
              private loginService: LoginService,
              private eventoService: EventoService,
              private device: Device,
              public loadingCtrl: LoadingController,
              private sanitizer: DomSanitizer,
              private geolocation: Geolocation,
              private locationAccuracy: LocationAccuracy,
              private diagnostic: Diagnostic,
              public alertCtrl: AlertController) {
    this.usuarioEntity = new UsuarioEntity();
    this.versaoAppEntity = new VersaoAppEntity();
    this.eventoListEntity = new EventoListEntity();
  }
  
  ionViewWillEnter() {
    this.showLoading = true;
    // this.dadosEvento = [];    
    // this.listEventosProximos = [];
    this.idUsuarioLogado = localStorage.getItem(Constants.ID_USUARIO);
    this.getAtualizacaoStatus();
  }

  loadMore(infiniteScroll) {
    setTimeout(() => {
      this.findEventosDestaqueAndCidade(infiniteScroll);
    }, 500);
  }

  selectedTabChanged($event): void {
    this.errorConnection = null;
    this.dadosEventosProximos = null;
    this.dadosEvento = null;
    if ($event._value == "destaquesList") {
      this.findEventosDestaqueAndCidade(null);
    } else {
        // para testes no browser acesso direto o this.getLocationPosition()
        if (this.platform.is('cordova')) {
          this.getGpsStatus();
        } else {
          this.getLocationPosition();
        }
        // this.getLocationPosition();
    }
  }

  checkPlatform() {
    this.segment = "proximosList";
    // para testes no browser acesso direto o this.getLocationPosition()
    if (this.platform.is('cordova')) {
      this.getGpsStatus();
    } else {
      this.getLocationPosition();
    }
    // this.getLocationPosition();
  }

  getGpsStatus() {
    let successCallback = (isAvailable) => { console.log('Is available? ' + isAvailable); };
    let errorCallback = (e) => console.error(e);

      this.diagnostic.isLocationEnabled().then(successCallback).catch(errorCallback);

      // only android
      this.diagnostic.isGpsLocationEnabled().then(successCallback, errorCallback);

      this.diagnostic.isLocationEnabled()
      .then((state) => {
        if (state == true) {
          this.getLocationPosition();
        } else {
          this.locationAccuracy.canRequest().then((canRequest: boolean) => {
            if(canRequest) {
              // the accuracy option will be ignored by iOS
              this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY)
              .then(() => {
                this.getLocationPosition();
              }).catch((error) => {
                // this.showLocationText();
               });
            }

          });
        }
      }).catch(e => console.error(e));
  }

  showLocationText() {
    let prompt = this.alertCtrl.create({
      title: 'Localização',
      message: 'Não foi possível obter a localização atual!',
      buttons: [
        {
          text: 'OK',
          handler: data => {
            // this.findPublicidadePropaganda(0,0);
          }
        }
      ]
    });
    prompt.present();
  }

  getAtualizacaoStatus() {
    try {

      // PARA TESTES NO BROWSER
      if (!this.platform.is('cordova')) {
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
        this.errorConnection = err.message ? err.message : 'Não foi possível conectar ao servidor';
        this.showLoading = false;
        this.errorConnection = null;
      });

    }catch (err){
      if(err instanceof RangeError){
      }
      console.log(err);
    }
  }

  verificaIdUsuario() {

    if(!this.idUsuarioLogado){
      this.findEventosDestaqueAndCidade(null);
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
        this.findEventosDestaqueAndCidade(null);
      }, (err) => {
        this.errorConnection = err.message ? err.message : 'Não foi possível conectar ao servidor';
        this.dadosEvento = [];
      });

    }catch (err){
      if(err instanceof RangeError){
      }
      console.log(err);
    }
  }

  findEventosDestaqueAndCidade(infiniteScroll: any) {
    try {
      // this.showLoading = true;
      if(this.dadosEvento) {
        this.eventoListEntity.limiteDados = this.eventoListEntity.limiteDados ? this.dadosEvento.length : null;
      }

      this.eventoService.findEventosDestaqueAndCidade()
      .then((eventoResult: EventoListEntity) => {
        this.dadosEvento = eventoResult;
        this.eventoListEntity.limiteDados = this.dadosEvento.length;

        if(infiniteScroll) {
          infiniteScroll.complete();
        }
        this.showLoading = false;
      }, (err) => {
        this.errorConnection = err.message ? err.message : 'Não foi possível conectar ao servidor';
        this.showLoading = false;
        this.dadosEvento = [];
      });

    }catch (err){
      if(err instanceof RangeError){
      }
      console.log(err);
    }
  }

  findEventosDestaqueAndCidadeProximosaMim(infiniteScroll: any, latitude, longitude) {
    try {
      // this.dadosEventosProximos = [];
      this.eventoListEntity.latitude = latitude;
      this.eventoListEntity.longitude = longitude;
      if(this.dadosEventosProximos) {
        this.eventoListEntity.limiteDados = this.eventoListEntity.limiteDados ? this.dadosEventosProximos.length : null;
      }

      this.eventoService.findEventosDestaqueAndCidadeProximosaMim(this.eventoListEntity)
      .then((eventoResult: EventoListEntity) => {
        this.dadosEventosProximos = eventoResult;
        // this.listEventosProximos = eventoResult;
        console.log(this.dadosEventosProximos);
        this.eventoListEntity.limiteDados = this.dadosEventosProximos.length;
        // this.eventoListEntity.limiteDados = this.listEventosProximos.length;

        if(infiniteScroll) {
          infiniteScroll.complete();
        }
        this.showLoading = false;
      }, (err) => {
        this.showLoading = false;
        this.errorConnection = err.message ? err.message : 'Não foi possível conectar ao servidor';
        this.dadosEventosProximos = [];
      });

    }catch (err){
      if(err instanceof RangeError){
      }
      console.log(err);
    }
  }

  getLocationPosition() {
    this.showLoading = true;
    this.geolocation.getCurrentPosition().then((resp) => {
      // this.findEventosDestaqueAndCidadeProximosaMim(null, -19.9299007, -43.9320145);
      this.findEventosDestaqueAndCidadeProximosaMim(null, resp.coords.latitude, resp.coords.longitude);
     }).catch((error) => {
       this.errorGetLocation();
       console.log('Error getting location', error);
     });
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

  errorGetLocation() {
    const alert = this.alertCtrl.create({
      title: "Falha ao obter localização",
      subTitle: "Não foi possível obter sua localização atual",
      buttons: [
        {
        text: 'OK',
          handler: () => {
            // this.getPlatform(versao);
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
  
  openDetalheEventoPage(idEvento: any, lastButtonDetalhe: string) {
    this.navCtrl.push(DetalheEventoPage, {
      idEvento: idEvento,
      lastButtonDetalhe: lastButtonDetalhe
    })
  }

}
