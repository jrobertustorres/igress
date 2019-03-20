import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ModalController, LoadingController, AlertController } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';

//ENTITYS
import { EventoListEntity } from '../../model/evento-list-entity';
import { EventoDetalheEntity } from '../../model/evento-detalhe-entity';

//SERVICES
import { EventoService } from '../../providers/evento-service';

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
  private lastViewDetalhe: string;
  private eventoDetalheEntity: EventoDetalheEntity;
  // private dadosEventoDetalhe: any;
  private idEvento: number;

  constructor(public navCtrl: NavController, 
              public modalCtrl: ModalController,
              private eventoService: EventoService,
              public events: Events,
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController,
              private sanitizer: DomSanitizer,
              public navParams: NavParams) {
    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
    this.lastViewDetalhe = navParams.get('lastViewDetalhe');
    this.eventoDetalheEntity = new EventoDetalheEntity();
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

  subtrairIngresso(item) {
    item.quantidadeItem -= 1;
    // this.showLoading = false;
    if (item.quantidadeItem < 1) {
      item.quantidadeItem = 1;
    } else {
        // this.calculoValorItemCarrinho(item);
    }
  }

  incrementaIngresso(item) {
    item.quantidadeItem += 1;
    // this.showLoading = false;
    // this.calculoValorItemCarrinho(item);
  }

  findEventoDetalheByIdEvento() {
    try {
      this.loading = this.loadingCtrl.create({
        content: "Aguarde...",
        spinner: 'crescent',
      });
      this.loading.present();

      this.eventoDetalheEntity.idEvento = this.idEvento;
      this.eventoService.findEventoDetalheByIdEvento(this.eventoDetalheEntity)
      .then((eventoDetalheResult: EventoDetalheEntity) => {
        this.eventoDetalheEntity = eventoDetalheResult;

        // console.log(this.eventoDetalheEntity.imagemEvento);

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

  openModalQrcode(){
    let modal = this.modalCtrl.create(ModalQrcodePage);
    modal.present();
  }

}
