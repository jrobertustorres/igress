import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Events, AlertController, ToastController } from 'ionic-angular';

//SERVICES
import { CartaoService } from '../../providers/cartao-service';
import { UsuarioService } from '../../providers/usuario-service';
import { PagamentoService } from '../../providers/pagamento-service';

//ENTITIES
import { CartaoCreditoEntity } from '../../model/cartao-credito-entity';
import { UsuarioDetalheEntity } from './../../model/usuario-detalhe-entity';
import { LoteIngressoListEntity } from '../../model/lote-ingresso-list-entity';
import { VendaEntity } from '../../model/venda-entity';
import { VendaDetalheEntity } from '../../model/venda-detalhe-entity';

//PAGES
import { DetalheEventoPage } from '../detalhe-evento/detalhe-evento';
import { MeusIngressosListPage } from '../meus-ingressos-list/meus-ingressos-list';

@IonicPage()
@Component({
  selector: 'page-pagamento',
  templateUrl: 'pagamento.html',
})
export class PagamentoPage {
  private loading = null;
  tabBarElement: any;
  public telefoneTitular: any;
  private cartaoCreditoEntity: CartaoCreditoEntity;
  private usuarioDetalheEntity: UsuarioDetalheEntity;
  private loteIngressoListEntity: LoteIngressoListEntity;
  private vendaEntity: VendaEntity;
  private vendaDetalheEntity: VendaDetalheEntity;
  public showLoading: boolean = true;
  private errorConnection: boolean = false;
  private hashCartaoCredito: string;
  private numeroInvalido: boolean = false;
  private codigoSegurancaInvalido: boolean = false;
  private dataExpiracaoInvalida: boolean = false;
  public idCidade: number = null;
  public cidade: string;
  public dadosCidades = {'idCidade': this.idCidade, 'cidade': this.cidade};
  public idEstado: number = null;
  private estados = [];
  private cidades: any = [];
  public dataNascimentoTitular: string;
  public bandeira: string;
  public imgCartao: string;
  public arrayLotePagamento: any;
  public telaRevenda: boolean;
  public idEvento: number;

  //TIMER
  public timeInSeconds: number;
  public time: any;
  public remainingTime: any;
  public displayTime: any;
  public runTimer: any;
  public hasStarted: any;
  public hasFinished: any;

  constructor(public navCtrl: NavController, 
              public loadingCtrl: LoadingController,
              private cartaoService: CartaoService,
              private usuarioService: UsuarioService,
              private pagamentoService: PagamentoService,
              public events: Events,
              public alertCtrl: AlertController,
              private toastCtrl: ToastController,
              public navParams: NavParams) {
    this.cartaoCreditoEntity = new CartaoCreditoEntity();
    this.usuarioDetalheEntity = new UsuarioDetalheEntity();
    this.loteIngressoListEntity = new LoteIngressoListEntity();
    this.vendaEntity = new VendaEntity();
    this.vendaDetalheEntity = new VendaDetalheEntity();
    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
    this.arrayLotePagamento = navParams.get("arrayLotePagamento");
    this.loteIngressoListEntity = this.arrayLotePagamento;
    this.telaRevenda = navParams.get("telaRevenda");
    this.idEvento = navParams.get("idEvento");

    this.initTimer(0); 
  }

  ngOnInit() {
    this.findDadosPagamento();
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
      message: 'Compra realizada. Seu pagamento está sendo processado.',
      duration: 3000,
      position: 'bottom',
      cssClass: "toast-success"
    });

    toast.onDidDismiss(() => {
    });

    toast.present();
  }

  findDadosPagamento() {
    try {

      this.loading = this.loadingCtrl.create({
        content: '',
      });
      this.loading.present();

      if(this.telaRevenda) {
        this.vendaEntity.listLoteIngressoListEntity = null;
        this.vendaEntity.listIngressoListEntity = this.arrayLotePagamento;
      } else {
        this.vendaEntity.listIngressoListEntity = null;
        this.vendaEntity.listLoteIngressoListEntity = this.arrayLotePagamento;
      }

      this.pagamentoService.findVendaDetalheByLoteIngresso(this.vendaEntity)
      .then((dadosResult: VendaDetalheEntity) => {
        this.vendaDetalheEntity = dadosResult;
        this.initTimer(this.vendaDetalheEntity.tempoMinutosTelaVenda);
        this. startTimer(); 

        if(dadosResult.tipoCartaoCreditoEnum) {
          this.consultaBandeira(dadosResult.tipoCartaoCreditoEnum);
          this.vendaDetalheEntity.numeroCartaoCredito = dadosResult.tipoCartaoCreditoEnum + ' .... ' + dadosResult.numeroCartaoCredito;
        }
        
        this.loading.dismiss();
      }, (err) => {
        this.loading.dismiss();
        this.errorConnection = err.message ? err.message : 'Não foi possível conectar ao servidor';
        this.showLoading = false;
      });

    }catch (err){
      if(err instanceof RangeError){
      }
      console.log(err);
    }
  }

  comprarIngressos() {

    try {
      this.loading = this.loadingCtrl.create({
        content: "",
      });
      this.loading.present();

      this.vendaEntity.qtdParcelas = this.vendaDetalheEntity.qtdParcela ? this.vendaDetalheEntity.qtdParcela : 1;

      if(this.telaRevenda) {
        this.vendaEntity.listIngressoListEntity = this.arrayLotePagamento;
      } else {
        this.vendaEntity.listLoteIngressoListEntity = this.arrayLotePagamento;
      }

      console.log(this.vendaEntity);

      this.pagamentoService.compraIngresso(this.vendaEntity, this.telaRevenda)
      .then((vendaResult: VendaEntity) => {
        this.loading.dismiss();
        this.presentToast();

        this.navCtrl.push(DetalheEventoPage, {
          lastButtonDetalhe: 'DETALHE',
          idEvento: this.idEvento})
        .then(() => {
          const startIndex = this.navCtrl.getActive().index - 2;
          this.navCtrl.remove(startIndex, 2);
        });

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

  consultaBandeira(tipoCartaoCreditoEnum: string) {

    switch(tipoCartaoCreditoEnum) { 
      case 'MASTERCARD': { 
         this.bandeira = 'MASTERCARD';
         this.imgCartao = "assets/imgs/master.png";
         break; 
        } 
        case 'VISA': { 
          this.bandeira = 'VISA';
          this.imgCartao = "assets/imgs/visa.png";
          break; 
        } 
        case 'AMEX': { 
          this.bandeira = 'AMERICAN_EXPRESS';
          this.imgCartao = "assets/imgs/amex.png";
          break; 
        } 
        case 'DINERS': { 
          this.bandeira = 'DINERS';
          this.imgCartao = "assets/imgs/diners.png";
          break; 
        } 
        case 'HIPERCARD': {
          this.bandeira = 'HIPER';
          this.imgCartao = "assets/imgs/hipercard.png";
          break; 
        } 
        case 'ELO': {
          this.bandeira = 'ELO';
          this.imgCartao = "assets/imgs/elo.png";
          break; 
        } 
        case 'HIPER': {
          this.bandeira = 'HIPER';
          this.imgCartao = "assets/imgs/hipercard.png";
         break; 
      } 
      default: { 
         //statements; 
         break; 
      } 
   } 
  }

  initTimer(minutos) {
    let tempo: number = minutos*60;
    this.timeInSeconds = tempo;
 
    this.time = this.timeInSeconds;
    this.remainingTime = this.timeInSeconds;    
    this.displayTime = this.getSecondsAsDigitalClock(this.remainingTime);
 }
 
 startTimer() {
   this.runTimer = true;
   this.hasStarted = true;
   this.timerTick();
 }
 
 pauseTimer() {
   this.runTimer = false;
 }
 
 resumeTimer() {
   this.startTimer();
 }
 
 timerTick() {
   setTimeout(() => {
 
     if (!this.runTimer) { return; }
     this.remainingTime--;
     this.displayTime = this.getSecondsAsDigitalClock(this.remainingTime);
     if (this.remainingTime > 0) {
       this.timerTick();
     }
     else {
       this.hasFinished = true;
     }
   }, 1000);
 }
 
 getSecondsAsDigitalClock(inputSeconds: number) {
   var sec_num = parseInt(inputSeconds.toString(), 10); // don't forget the second param
   var hours = Math.floor(sec_num / 3600);
   var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
   var seconds = sec_num - (hours * 3600) - (minutes * 60);
   var hoursString = '';
   var minutesString = '';
   var secondsString = '';
   hoursString = (hours < 10) ? "0" + hours : hours.toString();
   minutesString = (minutes < 10) ? "0" + minutes : minutes.toString();
   secondsString = (seconds < 10) ? "0" + seconds : seconds.toString();
   
   if(this.displayTime == '00:01') {
    this.navCtrl.pop();
  }

   return minutesString + ':' + secondsString;
  //  return hoursString + ':' + minutesString + ':' + secondsString;
 }

}
