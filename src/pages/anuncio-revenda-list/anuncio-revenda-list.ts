import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';
import { Constants } from '../../app/constants';

//SERVICES
import { EventoService } from '../../providers/evento-service';

//ENTITIES
import { EventoListEntity } from '../../model/evento-list-entity';

//PAGES
import { DetalheEventoPage } from '../detalhe-evento/detalhe-evento';

@IonicPage()
@Component({
  selector: 'page-anuncio-revenda-list',
  templateUrl: 'anuncio-revenda-list.html',
})
export class AnuncioRevendaListPage {
  private eventoListEntity: EventoListEntity;
  public anuncioList: any = [];
  public showLoading: boolean = true;
  private errorConnection: boolean = false;
  public idUsuario: string = null;

  constructor(public navCtrl: NavController, 
              public eventoService: EventoService,
              private sanitizer: DomSanitizer,
              public platform: Platform,
              public navParams: NavParams) {
    this.eventoListEntity = new EventoListEntity();
    this.platform.registerBackButtonAction(()=>this.myHandlerFunction());
  }

  ngOnInit() {
  }
  
  ionViewWillEnter(){
    this.showLoading = true;
    this.anuncioList = null;
    this.idUsuario = localStorage.getItem(Constants.ID_USUARIO);
    this.getListaAnuncioRevenda();
  }

  // se o loading estiver ativo, permite fechar o loading e voltar à tela anterior
  myHandlerFunction(){
    if(this.showLoading) {
      this.showLoading = false;
      this.navCtrl.pop();
    }
  }

  getListaAnuncioRevenda() {
    try {

      this.eventoService.findAnuncioRevenda()
      .then((ingressosListResult: EventoListEntity) => {
        this.anuncioList = ingressosListResult;
        // console.log(this.anuncioList);
        this.showLoading = false;

      }, (err) => {
        this.errorConnection = err.message ? err.message : 'Não foi possível conectar ao servidor';
        this.showLoading = false;
        this.anuncioList = [];
      });
  
    }catch (err){
        if(err instanceof RangeError){
        }
        console.log(err);
    }
  }

  openDetalheEventoPage(idEvento: any, lastButtonDetalhe: string) {
    this.navCtrl.push(DetalheEventoPage, {
      lastButtonDetalhe: lastButtonDetalhe,
      idEvento: idEvento
    })
  }

}
