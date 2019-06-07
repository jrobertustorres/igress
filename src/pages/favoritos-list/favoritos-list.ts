import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController, Events, Platform } from 'ionic-angular';
import { Constants } from '../../app/constants';
import { DomSanitizer } from '@angular/platform-browser';

//SERVICES
import { FavoritosService } from './../../providers/favoritos-service';

//ENTITYS
import { FavoritoEventoUsuarioEntity } from '../../model/favorito-evento-usuario-entity';

//PAGES
import { DetalheEventoPage } from '../detalhe-evento/detalhe-evento';

@IonicPage()
@Component({
  selector: 'page-favoritos-list',
  templateUrl: 'favoritos-list.html',
})
export class FavoritosListPage {
  public favoritosList: any;
  private favoritoEventoUsuarioEntity: FavoritoEventoUsuarioEntity;
  private toastMessage: string;
  public idUsuario: string = null;
  public showLoading: boolean = true;
  private errorConnection: boolean = false;

  constructor(public navCtrl: NavController, 
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController,
              private toastCtrl: ToastController,
              public favoritosService: FavoritosService,
              public events: Events,
              public platform: Platform,
              private sanitizer: DomSanitizer,
              public navParams: NavParams) {
    this.favoritoEventoUsuarioEntity = new FavoritoEventoUsuarioEntity();
    this.platform.registerBackButtonAction(()=>this.myHandlerFunction());
  }

  ngOnInit() {
  }
  
  ionViewWillEnter(){
    this.favoritosList = null;
    this.idUsuario = localStorage.getItem(Constants.ID_USUARIO);
    if (localStorage.getItem(Constants.ID_USUARIO)) {
      this.showLoading = true;
      this.getListaFavoritos(null);
    } else {
      this.showLoading = false;
    }
  }

  // se o loading estiver ativo, permite fechar o loading e voltar à tela anterior
  myHandlerFunction(){
    if(this.showLoading) {
      this.showLoading = false;
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

  loadMore(infiniteScroll) {
    setTimeout(() => {
      this.getListaFavoritos(infiniteScroll);
    }, 500);
  }

  getListaFavoritos(infiniteScroll: any) {
    try {
      this.favoritoEventoUsuarioEntity.limiteDados = this.favoritoEventoUsuarioEntity.limiteDados ? this.favoritosList.length : null;

      this.favoritosService.findFavoritosByUsuario()
      .then((favoritosListResult: FavoritoEventoUsuarioEntity) => {
        this.favoritosList = favoritosListResult;
        this.favoritoEventoUsuarioEntity.limiteDados = this.favoritosList.length;

        if(infiniteScroll) {
          infiniteScroll.complete();
        }
        this.showLoading = false;

      }, (err) => {
        this.errorConnection = err.message ? err.message : 'Não foi possível conectar ao servidor';
        this.showLoading = false;
        this.favoritosList = [];
      });

    }catch (err){
      if(err instanceof RangeError){
      }
      console.log(err);
    }
  }

  confirmaRemover(idFavoritoEventoUsuario: number) {
    const confirm = this.alertCtrl.create({
      title: 'Evento favorito',
      message: 'Remover este evento dos seus favoritos?',
      buttons: [
        {
          text: 'MANTER',
          handler: () => {
          }
        },
        {
          text: 'REMOVER',
          handler: () => {
            this.removerFavorito(idFavoritoEventoUsuario);
          }
        }
      ]
    });
    confirm.present();
  }

  removerFavorito(idFavoritoEventoUsuario: number) {
    try {
      this.showLoading = true;

      this.favoritoEventoUsuarioEntity.idFavoritoEventoUsuario = idFavoritoEventoUsuario;
      this.favoritosService.removeFavoritos(this.favoritoEventoUsuarioEntity)
      .then((favoritosListResult: FavoritoEventoUsuarioEntity) => {
        this.getListaFavoritos(null);
        this.toastMessage = 'O evento foi removido dos seus favoritos!';
        this.presentToast();
      }, (err) => {
        this.errorConnection = err.message ? err.message : 'Não foi possível conectar ao servidor';
      });

    }catch (err){
      if(err instanceof RangeError){
      }
      console.log(err);
    }
  }

  openDetalheEventoPage(idEvento: any, lastButtonDetalhe: string) {
    this.navCtrl.push(DetalheEventoPage, {
      idEvento: idEvento,
      lastButtonDetalhe: lastButtonDetalhe,
    })
  }

}
