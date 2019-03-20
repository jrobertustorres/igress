import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, ViewController, Platform } from 'ionic-angular';

//SEVICES
import { CidadesService } from '../../providers/cidades-service';
import { Constants } from '../../app/constants';

@IonicPage()
@Component({
  selector: 'page-modal-cidades',
  templateUrl: 'modal-cidades.html',
})
export class ModalCidadesPage {
  private loading = null;
  public idEstado: number;
  private cidades = [];
  private cidadesPorEstado: any = [];

  constructor(public navCtrl: NavController, 
              public loadingCtrl: LoadingController,
              private cidadesService: CidadesService,
              public alertCtrl: AlertController,
              public viewCtrl: ViewController,
              public platform: Platform,
              public navParams: NavParams) {
    this.idEstado = navParams.get('idEstado');
    this.platform.registerBackButtonAction(()=>this.myHandlerFunction());
  }

  ngOnInit() {
    this.getCidadesByEstado(this.idEstado);
  }

  ionViewDidLoad() {
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }

  // se o loading estiver ativo, permite fechar o loading e voltar à tela anterior
  myHandlerFunction(){
    if(this.loading) {
      this.loading.dismiss();
      this.navCtrl.pop();
    }
  }

  getItems(searchbar) {
    let q = searchbar.srcElement.value;
    if (!q) {
      this.getCidadesByEstado(this.idEstado);
    }
  
    this.cidadesPorEstado = JSON.parse(localStorage.getItem(Constants.CIDADES_POR_ESTADO));
    this.cidades = this.cidadesPorEstado;
    this.cidades = this.cidades.filter((v) => {
      if(v.cidade && q) {
        if (v.cidade.toLowerCase().indexOf(q.toLowerCase()) > -1) {
          return true;
        }
        return false;
      }
    });
  }

  getCidadesByEstado(idEstado: any) {
    try {

      this.loading = this.loadingCtrl.create({
        content: 'Buscando cidades...',
      });
      this.loading.present();

      this.cidadesService
        .getCidades(idEstado)
        .then((listCidadesResult) => {
          this.cidades = listCidadesResult;

          this.cidadesPorEstado = JSON.stringify(this.cidades);
          localStorage.setItem(Constants.CIDADES_POR_ESTADO, this.cidadesPorEstado);

          this.loading.dismiss();
        })
        .catch(err => {
          this.loading.dismiss();
          this.alertCtrl.create({
            subTitle: err.message,
            buttons: ['OK']
          }).present();
        });
    } catch (err) {
      if (err instanceof RangeError) {
      }
      console.log(err);
    }
  }

  setCidade(idCidade, cidade) {
    this.viewCtrl.dismiss({
      idCidade: idCidade, cidade: cidade
    });
  }

}
