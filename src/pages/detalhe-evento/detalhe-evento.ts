import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ModalController, LoadingController, AlertController, ToastController, Platform } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';
import { MaskUtil } from "../../utilitarios/mask";
import { Constants } from '../../app/constants';

//ENTITYS
import { EventoDetalheEntity } from '../../model/evento-detalhe-entity';
import { FavoritoEventoUsuarioEntity } from '../../model/favorito-evento-usuario-entity';
import { AnuncioIngressoListEntity } from '../../model/anuncio-ingresso-list-entity';

//SERVICES
import { EventoService } from '../../providers/evento-service';
import { FavoritosService } from '../../providers/favoritos-service';

//PAGES
import { ModalQrcodePage } from '../modal-qrcode/modal-qrcode';
import { ModalEntrarCadastrarPage } from '../modal-entrar-cadastrar/modal-entrar-cadastrar';
import { PagamentoPage } from '../pagamento/pagamento';
// import { MeusIngressosListPage } from '../meus-ingressos-list/meus-ingressos-list';

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
  public dadosServicoCalculo: any;
  private errorConnection: string = '';
  private valorTotalIngressoFormat: string;
  private ingressosMarcados = [];
  private habilitaBotao: boolean = false; 
  private qtdIngressoAdicionado: number = 0; 
  public listIngressoRevenda = [];
  private idUsuarioLogado: string;

  public status: string;
  public statusEnum: string;

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
              public platform: Platform,
              public navParams: NavParams) {
    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
    this.eventoDetalheEntity = new EventoDetalheEntity();
    this.favoritoEventoUsuarioEntity = new FavoritoEventoUsuarioEntity();
    this.anuncioIngressoListEntity = new AnuncioIngressoListEntity();
    this.idEvento = navParams.get("idEvento");
    this.lastButtonDetalhe = navParams.get("lastButtonDetalhe");
    this.platform.registerBackButtonAction(()=>this.myHandlerFunction());
    this.idUsuarioLogado = localStorage.getItem(Constants.ID_USUARIO);

  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.tabBarElement.style.display = 'none';
    this.events.publish('showButtonEvent:change', false);

    if(this.lastButtonDetalhe == 'REVENDA') {
      this.findIngressoDetalheRevendaByIdEvento();
    } else if(this.lastButtonDetalhe == 'DETALHE'){
      this.findIngressoDetalheByIdEvento();
    }
    if(this.lastButtonDetalhe == 'HOME' || this.lastButtonDetalhe == 'FAVORITOLIST') {
      this.findEventoDetalheByIdEvento();
    }
    if(this.lastButtonDetalhe == 'ANUNCIOLIST') {
      this.findAnuncioDetalheByIdEvento();
    }
  }
    
  ionViewWillLeave() {
    this.tabBarElement.style.display = 'flex';
    this.events.publish('showButtonEvent:change', true);
  }

  // se o loading estiver ativo, permite fechar o loading e voltar à tela anterior
  myHandlerFunction(){
    if(this.showLoading || this.loading) {
      // this.showLoading = false;
      this.showLoading = this.showLoading ? this.showLoading : false;
      this.loading ? this.loading.dismiss() : '';
      this.navCtrl.pop();
    }
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

  findIngressosDisponivelByUsuario() {
    try {
      this.eventoDetalheEntity.idEvento = this.idEvento;
      this.eventoService.findIngressosDisponivelByUsuario()
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

  findAnuncioDetalheByIdEvento() {
    try {

      this.eventoDetalheEntity.idEvento = this.idEvento;
      this.eventoService.findAnuncioDetalheByIdEvento(this.eventoDetalheEntity)
      .then((eventoDetalheResult: EventoDetalheEntity) => {
        this.eventoDetalheEntity = eventoDetalheResult;
        console.log(this.eventoDetalheEntity);
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
    // this.qtdIngressoAdicionado = ingresso.qtdIngresso;
    this.alteraCalculoLoteIngressoEvento(ingresso);
  }

  subtrairIngresso(ingresso) {
    ingresso.qtdIngresso -= 1;
    // this.qtdIngressoAdicionado = ingresso.qtdIngresso;
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

      // for(let j =0; j<ingresso.length; j++){
      //   this.habilitaBotao = ingresso.qtdIngresso > 0 ? true : false;
      // }
      let qtdTotal = 0;
      
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
      
      for(let j =0; j<this.listLoteIngressoListEntity.length; j++){
        if(this.listLoteIngressoListEntity[j].qtdIngresso > 0) {
          qtdTotal = this.listLoteIngressoListEntity[j].qtdIngresso;
        }
        this.habilitaBotao = qtdTotal > 0 ? true : false;
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
      });
      this.loading.present();
      this.favoritoEventoUsuarioEntity = new FavoritoEventoUsuarioEntity();
      this.favoritoEventoUsuarioEntity.idEvento = idEvento;

      this.favoritosService.adicionaFavoritos(this.favoritoEventoUsuarioEntity)
      .then((favoritoResult: FavoritoEventoUsuarioEntity) => {
        setTimeout(() => { 
          this.loading.dismiss();
        }, 3000);

        this.toastMessage = 'O evento foi adicionado aos seus favoritos!';
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

  removerFavoritoDetalhes(idFavoritoEventoUsuario: number){
    try {
      this.loading = this.loadingCtrl.create({
        content: "",
      });
      this.loading.present();

      this.favoritoEventoUsuarioEntity = new FavoritoEventoUsuarioEntity();
      this.favoritoEventoUsuarioEntity.idFavoritoEventoUsuario = idFavoritoEventoUsuario;
      this.favoritosService.removeFavoritos(this.favoritoEventoUsuarioEntity)
      .then((favoritoResult: FavoritoEventoUsuarioEntity) => {
        setTimeout(() => { 
          this.loading.dismiss();
        }, 1000);
        this.toastMessage = 'O evento foi removido dos seus favoritos!';
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

  getValorAnuncio(v: string, idIngresso: number) {
    for(let i =0;i<this.listIngressoListEntity.length;i++){
      if(this.listIngressoListEntity[i].idIngresso == idIngresso) {
        // this.valorAnuncio = this.mask.maskMoneyConvert(v); // antes
        // this.listIngressoListEntity[i]['valorAnuncio'] = this.valorAnuncio; // antes
        this.valorAnuncio = v;
        this.listIngressoListEntity[i]['valorAnuncio'] = v;
        // if(this.listIngressoListEntity[i]['valorAnuncio'].length == 0) { // antes
        if(this.listIngressoListEntity[i]['valorAnuncio'] == '0,00' || this.listIngressoListEntity[i]['valorAnuncio'] == '') {
          this.listIngressoListEntity[i].itemChecked = false;
          this.listIngressoListEntity[i]['valorAnuncio'] = '';
          this.valorAnuncio = null;
        } else {
          this.listIngressoListEntity[i].itemChecked = true;
        }
        this.alteraStatusBotao();
      }
    }
  }

  addCheckbox(event: any, idIngresso: number, statusIngressoEnum: string) {
    if ( event.checked ) {
      this.ingressosMarcados.push(idIngresso);
    } else {
      let index = this.removeCheckedFromArray(idIngresso);
      this.ingressosMarcados.splice(index,1);

      for(let i =0;i<this.listIngressoListEntity.length;i++){   
        if(this.listIngressoListEntity[i].idIngresso == idIngresso) {
          this.listIngressoListEntity[i]['valorAnuncio'] = '';
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
        if(this.listIngressoListEntity[i].itemChecked) {
          this.listAnuncioIngressoListEntity[i] = {
            idIngresso: this.listIngressoListEntity[i].idIngresso, 
            valorAnuncio: this.listIngressoListEntity[i].valorAnuncio 
          }
          this.listAnuncioIngressoListEntity[i].valorAnuncio = this.listAnuncioIngressoListEntity[i].valorAnuncio.replace(".", "");
          this.listAnuncioIngressoListEntity[i].valorAnuncio = this.listAnuncioIngressoListEntity[i].valorAnuncio.replace(",", ".");
        }
      }

      // remove o elemente se for null
      this.listAnuncioIngressoListEntity = this.listAnuncioIngressoListEntity.filter(function () { return true });
      this.anuncioIngressoListEntity.listAnuncioIngressoListEntity = this.listAnuncioIngressoListEntity;
      
      this.eventoService.adicionaIngressoRevenda(this.anuncioIngressoListEntity)
      .then((anuncioIngressoResult: AnuncioIngressoListEntity) => {
        this.anuncioIngressoListEntity = anuncioIngressoResult;

        this.findIngressoDetalheRevendaByIdEvento();

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

  removerLoteRevendaConfirm(idAnuncio: number) {
    let alert = this.alertCtrl.create({
      subTitle: 'Deseja realmente remover o lote da revenda?',
      buttons: [
        {
          text: 'Manter',
          role: 'cancel'
        },
        {
          text: 'Remover',
          handler: () => {
            this.removeIngressoRevenda(idAnuncio);
          }
        }
      ]
    });
    alert.present();
  }

  removeIngressoRevenda(idAnuncio: number) {
    try {

      this.loading = this.loadingCtrl.create({
        content: "",
      });
      this.loading.present();
      
      this.anuncioIngressoListEntity = new AnuncioIngressoListEntity();
      this.anuncioIngressoListEntity.idAnuncio = idAnuncio;
      this.eventoService.removeIngressoRevenda(this.anuncioIngressoListEntity)
      .then((anuncioIngressoResult: AnuncioIngressoListEntity) => {
        this.anuncioIngressoListEntity = anuncioIngressoResult;
        this.findIngressoDetalheRevendaByIdEvento();

        this.loading.dismiss();
        this.toastMessage = 'O lote foi retirado da revenda!';
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

  openPagamentoPage() {
    if(this.idUsuarioLogado) {
      let idLoteIngresso = null;
      let qtdIngresso = null;
      let arrayLotePagamento = [];
      let arrayLote = this.eventoDetalheEntity.listLoteIngressoListEntity;


      // for(let i =0;i<this.listIngressoListEntity.length;i++){
      //   if(this.listIngressoListEntity[i].itemChecked) {
      //     this.listAnuncioIngressoListEntity[i] = {
      //       idIngresso: this.listIngressoListEntity[i].idIngresso, 
      //       valorAnuncio: this.listIngressoListEntity[i].valorAnuncio 
      //     }
      //     this.listAnuncioIngressoListEntity[i].valorAnuncio = this.listAnuncioIngressoListEntity[i].valorAnuncio.replace(".", "");
      //     this.listAnuncioIngressoListEntity[i].valorAnuncio = this.listAnuncioIngressoListEntity[i].valorAnuncio.replace(",", ".");
      //   }
      // }

      for(let i = 0; i < arrayLote.length; i++){
        if(arrayLote[i].qtdIngresso > 0) {
          arrayLotePagamento[i] = {
            idLoteIngresso: arrayLote[i].idLoteIngresso,
            qtdIngresso: arrayLote[i].qtdIngresso
          }
        }
      }
      // console.log(arrayLotePagamento);
      // console.log(qtdIngresso);
      this.navCtrl.push(PagamentoPage, {
        arrayLotePagamento: arrayLotePagamento
        // qtdIngresso: qtdIngresso
      })
    } else {
      this.openModalEntrarCadastrarPage();      
    }
  }

  openModalEntrarCadastrarPage() {
    let modal = this.modalCtrl.create(ModalEntrarCadastrarPage);
    modal.present();
  }

  openModalQrcode(tokenIngresso: string){
    let modal = this.modalCtrl.create(ModalQrcodePage, { tokenIngresso: tokenIngresso });
    modal.present();
  }

}
