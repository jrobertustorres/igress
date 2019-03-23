import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ModalController, LoadingController, AlertController, ToastController } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';

//ENTITYS
import { EventoDetalheEntity } from '../../model/evento-detalhe-entity';
import { FavoritoEventoUsuarioEntity } from '../../model/favorito-evento-usuario-entity';

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
  // private lastViewDetalhe: string;
  private eventoDetalheEntity: EventoDetalheEntity;
  private favoritoEventoUsuarioEntity: FavoritoEventoUsuarioEntity;
  private idEvento: number;
  private toastMessage: string;
  public showIcon: boolean;
  public listLoteIngressoListEntity = [];

  public dadosServicoCalculo: any;

  private errorConnection: string;

  constructor(public navCtrl: NavController, 
              public modalCtrl: ModalController,
              private eventoService: EventoService,
              private favoritosService: FavoritosService,
              public events: Events,
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController,
              private sanitizer: DomSanitizer,
              private toastCtrl: ToastController,
              public navParams: NavParams) {
    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
    // this.lastViewDetalhe = navParams.get('lastViewDetalhe');
    this.eventoDetalheEntity = new EventoDetalheEntity();
    this.favoritoEventoUsuarioEntity = new FavoritoEventoUsuarioEntity();
    this.idEvento = navParams.get("idEvento");

  }

  ngOnInit() {
    this.findEventoDetalheByIdEvento();
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
      // this.loading = this.loadingCtrl.create({
      //   content: "Aguarde...",
      //   spinner: 'crescent',
      // });
      // this.loading.present();

      this.eventoDetalheEntity.idEvento = this.idEvento;
      this.eventoService.findEventoDetalheByIdEvento(this.eventoDetalheEntity)
      .then((eventoDetalheResult: EventoDetalheEntity) => {
        this.eventoDetalheEntity = eventoDetalheResult;
        this. listLoteIngressoListEntity = this.eventoDetalheEntity.listLoteIngressoListEntity;
        this.showIcon = this.eventoDetalheEntity.favorito ? true : false;

        // this.loading.dismiss();
      }, (err) => {
        this.errorConnection = err.message ? err.message : 'Não foi possível conectar ao servidor';
        // this.eventoDetalheEntity = new EventoDetalheEntity();
        // this.eventoDetalheEntity = null;

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

  incrementaIngresso(ingresso) {
    if(ingresso.qtdIngresso < ingresso.maxQtdIngressoCompra) {
      ingresso.qtdIngresso += 1;
    }
    // this.showLoading = false;
    this.alteraCalculoLoteIngressoEvento(ingresso);
  }

  subtrairIngresso(ingresso) {
    ingresso.qtdIngresso -= 1;
    // this.showLoading = false;
    if (ingresso.qtdIngresso < 1) {
      ingresso.qtdIngresso = 0;
    } else {
        this.alteraCalculoLoteIngressoEvento(ingresso);
    }
  }

  alteraCalculoLoteIngressoEvento(ingresso: any) {
    try {

      // console.log(ingresso);
      
      // ingresso = ingresso[0] ? ingresso[0] : ingresso;
      
      // this.dadosServicoCalculo.idLoteIngresso = this.eventoDetalheEntity.listLoteIngressoListEntity['idLoteIngresso'];
      // this.dadosServicoCalculo.qtdIngresso = this.eventoDetalheEntity.listLoteIngressoListEntity['qtdIngresso'];


      // this.eventoDetalheEntity.listLoteIngressoListEntity = [];
      

      // this.listServicoResposta[0].idServicoCotacao = this.listServicoResposta[0].idServicoCotacao;

      // this.dadosServicoCalculo = this.listServicoResposta;


      this.loading = this.loadingCtrl.create({
        content: 'Aguarde...'
      });
      this.loading.present();

      // EventoDetalheEntity(ListLoteIngressoListEntity[idLoteIngresso, qtdIngresso])
      
      console.log(this.eventoDetalheEntity.listLoteIngressoListEntity);
      // this.eventoDetalheEntity.listLoteIngressoListEntity[0].idLoteIngresso = ingresso.idLoteIngresso;
      // this.eventoDetalheEntity.listLoteIngressoListEntity[0].qtdIngresso = ingresso.qtdIngresso;
      
      // this.eventoDetalheEntity.listLoteIngressoListEntity[0].idLoteIngresso = this.eventoDetalheEntity.listLoteIngressoListEntity[0].idLoteIngresso;
      // this.eventoDetalheEntity.listLoteIngressoListEntity[0].qtdIngresso = ingresso.qtdIngresso;

      this.eventoService.alteraCalculoLoteIngressoEvento(this.eventoDetalheEntity.listLoteIngressoListEntity)
      .then((eventoResult: EventoDetalheEntity) => {
        
        // this.showLoading = false;
        // this.getDadosCarrinho();

      }, (err) => {
        this.loading.dismiss();
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
        content: 'Aguarde...'
      });
      this.loading.present();

      this.favoritoEventoUsuarioEntity = new FavoritoEventoUsuarioEntity();
      this.favoritoEventoUsuarioEntity.idEvento = idEvento;
      console.log(JSON.stringify(this.favoritoEventoUsuarioEntity));
      this.favoritosService.adicionaFavoritos(this.favoritoEventoUsuarioEntity)
      .then((favoritoResult: FavoritoEventoUsuarioEntity) => {

        console.log(favoritoResult);

        this.loading.dismiss();
        this.toastMessage = 'O evento foi adicionado aos seus favoritos!';
        this.presentToast();
      }, (err) => {
        this.loading.dismiss();
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

  removerFavoritoDetalhes(idFavoritoEventoUsuario: number){
    try {
      this.loading = this.loadingCtrl.create({
        content: 'Aguarde...'
      });
      this.loading.present();

      this.favoritoEventoUsuarioEntity = new FavoritoEventoUsuarioEntity();
      this.favoritoEventoUsuarioEntity.idFavoritoEventoUsuario = idFavoritoEventoUsuario;
      console.log(JSON.stringify(this.favoritoEventoUsuarioEntity));
      this.favoritosService.removeFavoritos(this.favoritoEventoUsuarioEntity)
      .then((favoritoResult: FavoritoEventoUsuarioEntity) => {

        console.log(favoritoResult);

        this.loading.dismiss();
        this.toastMessage = 'O evento foi removido dos seus favoritos!';
        this.presentToast();
      }, (err) => {
        this.loading.dismiss();
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

  openModalQrcode(){
    let modal = this.modalCtrl.create(ModalQrcodePage);
    modal.present();
  }

}
