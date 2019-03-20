import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController, Events, Platform } from 'ionic-angular';
import { Constants } from '../../app/constants';

//SERVICES
import { FavoritosService } from './../../providers/favoritos-service';

//ENTITYS
import { FavoritoEntity } from '../../model/favorito-entity';

@IonicPage()
@Component({
  selector: 'page-favoritos-list',
  templateUrl: 'favoritos-list.html',
})
export class FavoritosListPage {
  public loading = null;
  public favoritosList: any = null;
  private favoritoEntity: FavoritoEntity;
  private toastMessage: string;
  public idUsuario: string = null;
  public showLoading: boolean = true;

  constructor(public navCtrl: NavController, 
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController,
              private toastCtrl: ToastController,
              public favoritosService: FavoritosService,
              public events: Events,
              public platform: Platform,
              public navParams: NavParams) {
    this.favoritoEntity = new FavoritoEntity();
    this.platform.registerBackButtonAction(()=>this.myHandlerFunction());
  }

  ngOnInit() {
  }
  
  ionViewWillEnter(){
    this.favoritosList = null;
    this.idUsuario = localStorage.getItem(Constants.ID_USUARIO);
    if (localStorage.getItem(Constants.ID_USUARIO)) {
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

      if(this.showLoading == true) {
        this.loading = this.loadingCtrl.create({
          content: 'Aguarde...'
          // spinner: 'dots',
          // cssClass: 'transparent',
        });
        this.loading.present();
      }

      this.favoritosService.getFavoritos()
      .then((favoritosListResult: FavoritoEntity) => {
        this.favoritosList = favoritosListResult;
        this.showLoading = true;
        this.loading.dismiss();
      }, (err) => {
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

  removerFavorito(idFavoritos) {
    try {
      this.loading = this.loadingCtrl.create({
        content: 'Aguarde...'
      });
      this.loading.present();

      this.favoritoEntity.idFavoritos = idFavoritos;
      this.favoritosService.removerFavoritos(this.favoritoEntity)
      .then((favoritosListResult: FavoritoEntity) => {
        this.showLoading = false;
        this.getListaFavoritos();
        this.toastMessage = 'O produto foi removido dos seus favoritos!';
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

  showConfirmrRemover(idFavoritos) {
    const confirm = this.alertCtrl.create({
      title: 'Remover produto favorito?',
      message: 'Remover este produto dos seus favoritos?',
      buttons: [
        {
          text: 'MANTER',
          handler: () => {
          }
        },
        {
          text: 'REMOVER',
          handler: () => {
            this.removerFavorito(idFavoritos);
          }
        }
      ]
    });
    confirm.present();
  }

  // openProdutosPorLojaListPage(idProduto) {
  //   this.navCtrl.push(ProdutosPorLojaListPage, {
  //     idProduto: idProduto
  //   })
  // }

  // openLoginPage() {
  //   this.navCtrl.push(LoginPage);
  // }

}
