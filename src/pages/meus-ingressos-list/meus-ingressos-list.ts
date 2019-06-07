import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';
import { Constants } from '../../app/constants';

//ENTITIES
import { EventoListEntity } from '../../model/evento-list-entity';

//SERVICES
import { EventoService } from '../../providers/evento-service';

//PAGES
import { DetalheEventoPage } from '../detalhe-evento/detalhe-evento';

@IonicPage()
@Component({
  selector: 'page-meus-ingressos-list',
  templateUrl: 'meus-ingressos-list.html',
})
export class MeusIngressosListPage {
  private errorConnection: string;
  public ingressosList: any = null;
  public showLoading: boolean = true;
  private eventoListEntity: EventoListEntity;
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
    this.idUsuario = localStorage.getItem(Constants.ID_USUARIO);
    this.getListaIngressos(null);
  }

  // se o loading estiver ativo, permite fechar o loading e voltar à tela anterior
  myHandlerFunction(){
    if(this.showLoading) {
      this.showLoading = false;
      this.navCtrl.pop();
    }
  }

  loadMore(infiniteScroll) {
    setTimeout(() => {
      this.getListaIngressos(infiniteScroll);
    }, 500);
  }

  getListaIngressos(infiniteScroll: any) {
    try {
      this.eventoListEntity.limiteDados = this.eventoListEntity.limiteDados ? this.ingressosList.length : null;

      this.eventoService.findIngressosDisponivelByUsuario()
      .then((ingressosListResult: EventoListEntity) => {
        this.ingressosList = ingressosListResult;
        this.eventoListEntity.limiteDados = this.ingressosList.length;

        if(infiniteScroll) {
          infiniteScroll.complete();
        }
        this.showLoading = false;

      }, (err) => {
        this.errorConnection = err.message ? err.message : 'Não foi possível conectar ao servidor';
        this.ingressosList = [];
        this.showLoading = false;
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
