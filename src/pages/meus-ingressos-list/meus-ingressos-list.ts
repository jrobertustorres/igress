import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
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
              public navParams: NavParams) {
    this.eventoListEntity = new EventoListEntity();
  }

  ngOnInit() {
    this.idUsuario = localStorage.getItem(Constants.ID_USUARIO);
    this.getListaIngressos();
  }

  getListaIngressos() {
    try {

      this.eventoService.findIngressosDisponivelByUsuario()
      .then((ingressosListResult: EventoListEntity) => {
        this.ingressosList = ingressosListResult;
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
