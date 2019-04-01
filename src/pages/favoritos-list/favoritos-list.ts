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
  public loading = null;
  public favoritosList: any = null;
  private favoritoEventoUsuarioEntity: FavoritoEventoUsuarioEntity;
  private toastMessage: string;
  public idUsuario: string = null;
  public showLoading: boolean = true;
  private errorConnection: string;

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
      this.getListaFavoritos();
    }
  }

  // se o loading estiver ativo, permite fechar o loading e voltar à tela anterior
  myHandlerFunction(){
    if(this.loading) {
      this.loading.dismiss();
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

  getListaFavoritos() {
    try {

      this.favoritosService.findFavoritosByUsuario()
      .then((favoritosListResult: FavoritoEventoUsuarioEntity) => {
        this.favoritosList = favoritosListResult;
        this.showLoading = false;

        // this.showLoading = true;
        // this.loading.dismiss();
      }, (err) => {
        this.errorConnection = err.message ? err.message : 'Não foi possível conectar ao servidor';
        this.favoritosList = [];
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
      // this.loading = this.loadingCtrl.create({
      //   content: ''
      // });
      // this.loading.present();

      // this.loading = this.loadingCtrl.create({
      //   content: '',
      //   spinner: 'dots'
      // });
      
      this.showLoading = true;

      this.favoritoEventoUsuarioEntity.idFavoritoEventoUsuario = idFavoritoEventoUsuario;
      this.favoritosService.removeFavoritos(this.favoritoEventoUsuarioEntity)
      .then((favoritosListResult: FavoritoEventoUsuarioEntity) => {
        // this.showLoading = false;
        this.getListaFavoritos();
        this.toastMessage = 'O evento foi removido dos seus favoritos!';
        this.presentToast();
      }, (err) => {
        this.errorConnection = err.message ? err.message : 'Não foi possível conectar ao servidor';
        // this.loading.dismiss();
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

  openDetalheEventoPage(idEvento: any) {
    this.navCtrl.push(DetalheEventoPage, {
      idEvento: idEvento
    })
  }

}
