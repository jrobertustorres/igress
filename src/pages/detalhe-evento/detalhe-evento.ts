import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ModalController, LoadingController, AlertController, ToastController } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';
import { MaskUtil } from "../../utilitarios/mask";

//ENTITYS
import { EventoDetalheEntity } from '../../model/evento-detalhe-entity';
import { FavoritoEventoUsuarioEntity } from '../../model/favorito-evento-usuario-entity';
import { AnuncioIngressoListEntity } from '../../model/anuncio-ingresso-list-entity';

//SERVICES
import { EventoService } from '../../providers/evento-service';
import { FavoritosService } from '../../providers/favoritos-service';

//PAGES
import { ModalQrcodePage } from '../modal-qrcode/modal-qrcode';

@IonicPage()
@Component({
  selector: 'page-detalhe-evento',
  templateUrl: 'detalhe-evento.html',
})
export class DetalheEventoPage {
  private loading = null;
  tabBarElement: any;
  public showLoading: boolean = true;
  private eventoDetalheEntity: EventoDetalheEntity;
  private favoritoEventoUsuarioEntity: FavoritoEventoUsuarioEntity;
  private anuncioIngressoListEntity: AnuncioIngressoListEntity;
  private idEvento: number;
  private lastButtonDetalhe: string;
  private toastMessage: string;
  public showIcon: boolean;
  public valorAnuncio: any;
  public listLoteIngressoListEntity = [];

  public listAnuncioIngressoListEntity = [];

  public listIngressoListEntity = [];
  // public listIngressoRevenda: [];
  public dadosServicoCalculo: any;
  private errorConnection: string = '';
  private valorTotalIngressoFormat: string;
  private ingressosMarcados = [];
  private habilitaBotao: boolean = false; 

  public listIngressoRevenda = [];

  constructor(public navCtrl: NavController, 
              public modalCtrl: ModalController,
              private eventoService: EventoService,
              private favoritosService: FavoritosService,
              public events: Events,
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController,
              private sanitizer: DomSanitizer,
              private toastCtrl: ToastController,
              private mask: MaskUtil,
              public navParams: NavParams) {
    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
    // this.lastViewDetalhe = navParams.get('lastViewDetalhe');
    this.eventoDetalheEntity = new EventoDetalheEntity();
    this.favoritoEventoUsuarioEntity = new FavoritoEventoUsuarioEntity();
    this.anuncioIngressoListEntity = new AnuncioIngressoListEntity();
    // this.listIngressoRevenda = new AnuncioIngressoListEntity();
    this.idEvento = navParams.get("idEvento");
    this.lastButtonDetalhe = navParams.get("lastButtonDetalhe");
  }

  ngOnInit() {
    // if(this.lastButtonDetalhe == 'REVENDA' || this.lastButtonDetalhe == 'DETALHE') {
    if(this.lastButtonDetalhe == 'REVENDA') {
      // this.findIngressoDetalheByIdEvento();
      this.findIngressoDetalheRevendaByIdEvento();
    } else {
      this.findEventoDetalheByIdEvento();
    }
    // if(this.lastButtonDetalhe == 'DETALHE') {
    //   this.findIngressoDetalheByIdEvento();
    // }
  }

  ionViewWillEnter() {
    this.tabBarElement.style.display = 'none';
    this.events.publish('showButtonEvent:change', false);
  }
    
  ionViewWillLeave() {
    this.tabBarElement.style.display = 'flex';
    this.events.publish('showButtonEvent:change', true);
  }

  presentToast() {
    let toast = this.toastCtrl.create({
      message: this.toastMessage,
      duration: 3000,
      position: 'bottom',
      cssClass: "toast-success"
    });

    toast.onDidDismiss(() => {
    });

    toast.present();
  }

  findEventoDetalheByIdEvento() {
    try {
      this.eventoDetalheEntity.idEvento = this.idEvento;
      this.eventoService.findEventoDetalheByIdEvento(this.eventoDetalheEntity)
      .then((eventoDetalheResult: EventoDetalheEntity) => {
        this.eventoDetalheEntity = eventoDetalheResult;
        this.listIngressoListEntity = this.eventoDetalheEntity.listLoteIngressoListEntity;
        this.showIcon = this.eventoDetalheEntity.favorito ? true : false;
        this.showLoading = false;

      }, (err) => {
        this.errorConnection = err.message ? err.message : 'Não foi possível conectar ao servidor';
        this.showLoading = false;
      });

    }catch (err){
      if(err instanceof RangeError){
      }
      console.log(err);
    }
  }

  findIngressoDetalheByIdEvento() {
    try {
      this.eventoDetalheEntity.idEvento = this.idEvento;
      this.eventoService.findIngressoDetalheByIdEvento(this.eventoDetalheEntity)
      .then((eventoDetalheResult: EventoDetalheEntity) => {
        this.eventoDetalheEntity = eventoDetalheResult;
        this.listIngressoListEntity = this.eventoDetalheEntity.listIngressoListEntity;

        this.showIcon = this.eventoDetalheEntity.favorito ? true : false;
        this.showLoading = false;

      }, (err) => {
        this.errorConnection = err.message ? err.message : 'Não foi possível conectar ao servidor';
        this.showLoading = false;
      });

    }catch (err){
      if(err instanceof RangeError){
      }
      console.log(err);
    }
  }

  findIngressoDetalheRevendaByIdEvento() {
    try {
      this.eventoDetalheEntity.idEvento = this.idEvento;
      this.eventoService.findIngressoDetalheRevendaByIdEvento(this.eventoDetalheEntity)
      .then((eventoDetalheResult: EventoDetalheEntity) => {
        this.eventoDetalheEntity = eventoDetalheResult;
        this.listIngressoListEntity = this.eventoDetalheEntity.listIngressoListEntity;

        this.showIcon = this.eventoDetalheEntity.favorito ? true : false;
        this.showLoading = false;

      }, (err) => {
        this.errorConnection = err.message ? err.message : 'Não foi possível conectar ao servidor';
        this.showLoading = false;
      });

    }catch (err){
      if(err instanceof RangeError){
      }
      console.log(err);
    }
  }

  incrementaIngresso(ingresso) {
    if(ingresso.qtdIngresso < ingresso.maxQtdIngressoCompra) {
      ingresso.qtdIngresso += 1;
    }
    this.alteraCalculoLoteIngressoEvento(ingresso);
  }

  subtrairIngresso(ingresso) {
    ingresso.qtdIngresso -= 1;
    if (ingresso.qtdIngresso < 0) {
      ingresso.qtdIngresso = 0;
    } else {
        this.alteraCalculoLoteIngressoEvento(ingresso);
    }
  }

  alteraCalculoLoteIngressoEvento(ingresso: any) {
    try {

      this.loading = this.loadingCtrl.create({
        content: "",
      });
      this.loading.present();

      for(let i =0;i<this.listIngressoListEntity.length;i++){
        if(this.listIngressoListEntity[i].idLoteIngresso == ingresso.idLoteIngresso) {
          this.listLoteIngressoListEntity[i] = {
            idLoteIngresso: ingresso.idLoteIngresso,
            qtdIngresso: ingresso.qtdIngresso
          }
        } 
        else {
          this.listLoteIngressoListEntity[i] = {
            idLoteIngresso: this.listIngressoListEntity[i].idLoteIngresso,
            qtdIngresso: this.listIngressoListEntity[i].qtdIngresso == null ? 0 : this.listIngressoListEntity[i].qtdIngresso
          }
        }
      }

      this.eventoDetalheEntity.listLoteIngressoListEntity = this.listLoteIngressoListEntity;

      this.eventoService.alteraCalculoLoteIngressoEvento(this.listLoteIngressoListEntity)
      .then((eventoResult: EventoDetalheEntity) => {
        this.valorTotalIngressoFormat = eventoResult.valorTotalIngressoFormat;

        this.loading.dismiss();
      }, (err) => {
        this.loading.dismiss();
        this.alertCtrl.create({
          subTitle: err.message ? err.message : 'Não foi possível conectar ao servidor',
          buttons: ['OK']
        }).present();
      });

    }catch (err){
      if(err instanceof RangeError){
      }
      console.log(err);
    }

  }

  adicionaRemoveFavoritoDetalhes(idEvento: number, idFavoritoEventoUsuario: number){
    try {
      // this.showLoading = true;
      this.showIcon = !this.showIcon;

      if(!this.showIcon) {
        this.removerFavoritoDetalhes(idFavoritoEventoUsuario);
      } else {
        this.adicionaFavoritoDetalhes(idEvento);
      }
      
    }catch (err){
      if(err instanceof RangeError){
      }
      console.log(err);
    }
  }

  adicionaFavoritoDetalhes(idEvento: number) {

    try {
      this.loading = this.loadingCtrl.create({
        content: "",
        // spinner: 'circles'
      });
      this.loading.present();

      this.favoritoEventoUsuarioEntity = new FavoritoEventoUsuarioEntity();
      this.favoritoEventoUsuarioEntity.idEvento = idEvento;
      this.favoritosService.adicionaFavoritos(this.favoritoEventoUsuarioEntity)
      .then((favoritoResult: FavoritoEventoUsuarioEntity) => {
        setTimeout(() => { 
          // this.showLoading = false;
          this.loading.dismiss();
        }, 1000);

        // this.loading.dismiss();
        this.toastMessage = 'O evento foi adicionado aos seus favoritos!';
        this.presentToast();
      }, (err) => {
        // this.errorConnection = err.message ? err.message : 'Não foi possível conectar ao servidor';
        this.loading.dismiss();
        this.alertCtrl.create({
          subTitle: err.message ? err.message : 'Não foi possível conectar ao servidor',
          buttons: ['OK']
        }).present();
      });
    }catch (err){
      if(err instanceof RangeError){
      }
      console.log(err);
    }
  }

  removerFavoritoDetalhes(idFavoritoEventoUsuario: number){
    try {
      this.loading = this.loadingCtrl.create({
        content: "",
        // spinner: 'circles'
      });
      this.loading.present();

      this.favoritoEventoUsuarioEntity = new FavoritoEventoUsuarioEntity();
      this.favoritoEventoUsuarioEntity.idFavoritoEventoUsuario = idFavoritoEventoUsuario;
      this.favoritosService.removeFavoritos(this.favoritoEventoUsuarioEntity)
      .then((favoritoResult: FavoritoEventoUsuarioEntity) => {
        setTimeout(() => { 
          // this.showLoading = false;
          this.loading.dismiss();
        }, 1000);
        // this.loading.dismiss();
        this.toastMessage = 'O evento foi removido dos seus favoritos!';
        this.presentToast();
      }, (err) => {
        // this.errorConnection = err.message ? err.message : 'Não foi possível conectar ao servidor';
        this.loading.dismiss();
        this.alertCtrl.create({
          subTitle: err.message ? err.message : 'Não foi possível conectar ao servidor',
          buttons: ['OK']
        }).present();
      });

    }catch (err){
      if(err instanceof RangeError){
      }
      console.log(err);
    }
  }

  getValorAnuncio(v: string, idIngresso: number) {
    for(let i =0;i<this.listIngressoListEntity.length;i++){
      if(this.listIngressoListEntity[i].idIngresso == idIngresso) {
        this.valorAnuncio = this.mask.maskMoneyConvert(v);
        this.listIngressoListEntity[i]['valorAnuncio'] = this.valorAnuncio;

        if(this.listIngressoListEntity[i]['valorAnuncio'].length == 0) {
          this.listIngressoListEntity[i].itemChecked = false;
        } else {
          this.listIngressoListEntity[i].itemChecked = true;
        }
        this.alteraStatusBotao();
      }
    }
  }

  addCheckbox(event: any, idIngresso: number) {

    if ( event.checked ) {
      this.ingressosMarcados.push(idIngresso);
    } else {
      let index = this.removeCheckedFromArray(idIngresso);
      this.ingressosMarcados.splice(index,1);

      for(let i =0;i<this.listIngressoListEntity.length;i++){        
        if(this.listIngressoListEntity[i].idIngresso == idIngresso) {
          this.listIngressoListEntity[i]['valorAnuncio'] = '';
          // this.valorAnuncio = null;
          if(this.listIngressoListEntity[i]['valorAnuncio'].length == 0) {
            this.listIngressoListEntity[i].itemChecked = false;
          } else {
            this.listIngressoListEntity[i].itemChecked = true;
          }
        }
      }

    }
    this.alteraStatusBotao();

  }
  
  alteraStatusBotao() {
    if(this.ingressosMarcados.length == 0) {
      this.valorAnuncio = null;
    }
    this.habilitaBotao = (this.ingressosMarcados.length > 0 && this.valorAnuncio != undefined) ? true : false;
  }

  //Removes checkbox from array when you uncheck it
  removeCheckedFromArray(checkbox : number) {
    return this.ingressosMarcados.findIndex((ingresso)=>{
      return ingresso === checkbox;
    })
  }

  adicionaIngressoRevenda() {
    try {

      this.loading = this.loadingCtrl.create({
        content: "",
      });
      this.loading.present();
      
      for(let i =0;i<this.listIngressoListEntity.length;i++){
        // if(this.listIngressoListEntity[i].itemChecked ) {
        //   this.anuncioIngressoListEntity[i] = {
        //     idIngresso: this.listIngressoListEntity[i].idIngresso, 
        //     valorAnuncio: this.listIngressoListEntity[i].valorAnuncio 
        //   }
        if(this.listIngressoListEntity[i].itemChecked ) {
          this.listAnuncioIngressoListEntity[i] = {
            idIngresso: this.listIngressoListEntity[i].idIngresso, 
            valorAnuncio: this.listIngressoListEntity[i].valorAnuncio 
          }

          // let precision = (this.anuncioIngressoListEntity[i].valorAnuncio  + "").split(".")[1].length;
          // if(precision != 2) {

            this.listAnuncioIngressoListEntity[i].valorAnuncio = this.listAnuncioIngressoListEntity[i].valorAnuncio.replace(".", "");
            // this.anuncioIngressoListEntity[i].valorAnuncio = this.anuncioIngressoListEntity[i].valorAnuncio.replace(".", "");
          // }
          this.listAnuncioIngressoListEntity[i].valorAnuncio = this.listAnuncioIngressoListEntity[i].valorAnuncio.replace(",", ".");
          // this.anuncioIngressoListEntity[i].valorAnuncio = this.anuncioIngressoListEntity[i].valorAnuncio.replace(",", ".");
        }
      }

      this.anuncioIngressoListEntity.listAnuncioIngressoListEntity = this.listAnuncioIngressoListEntity;

      console.log(JSON.stringify(this.anuncioIngressoListEntity));
      // console.log(this.listAnuncioIngressoListEntity);
      console.log(this.anuncioIngressoListEntity);
      // console.log(this.anuncioIngressoListEntity.listAnuncioIngressoListEntity);

      this.eventoService.adicionaIngressoRevenda(this.anuncioIngressoListEntity)
      .then((anuncioIngressoResult: AnuncioIngressoListEntity) => {
        this.anuncioIngressoListEntity = anuncioIngressoResult;

        console.log(this.anuncioIngressoListEntity);

        this.loading.dismiss();
        this.toastMessage = 'O lote foi disponibilizado para revenda!';
        this.presentToast();
      }, (err) => {
        this.loading.dismiss();
        this.alertCtrl.create({
          subTitle: err.message ? err.message : 'Não foi possível conectar ao servidor',
          buttons: ['OK']
        }).present();
      });

    }catch (err){
      if(err instanceof RangeError){
      }
      console.log(err);
    }

  }

  openModalQrcode(tokenIngresso: string){
    let modal = this.modalCtrl.create(ModalQrcodePage, { tokenIngresso: tokenIngresso });
    modal.present();
  }

}
