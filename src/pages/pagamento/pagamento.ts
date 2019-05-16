import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Events, AlertController } from 'ionic-angular';
import { MaskUtil } from "../../utilitarios/mask";

//SERVICES
import { CartaoService } from '../../providers/cartao-service';
import { UsuarioService } from '../../providers/usuario-service';
import { PagamentoService } from '../../providers/pagamento-service';

//ENTITIES
import { CartaoCreditoEntity } from '../../model/cartao-credito-entity';
import { UsuarioDetalheEntity } from './../../model/usuario-detalhe-entity';
import { LoteIngressoListEntity } from '../../model/lote-ingresso-list-entity';
import { VendaEntity } from '../../model/venda-entity';

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
  // public idLoteIngresso: number;
  // public qtdIngresso: string;
  public arrayLotePagamento: any;

  constructor(public navCtrl: NavController, 
              public loadingCtrl: LoadingController,
              private cartaoService: CartaoService,
              private usuarioService: UsuarioService,
              private pagamentoService: PagamentoService,
              public events: Events,
              public alertCtrl: AlertController,
              public navParams: NavParams) {
    this.cartaoCreditoEntity = new CartaoCreditoEntity();
    this.usuarioDetalheEntity = new UsuarioDetalheEntity();
    this.loteIngressoListEntity = new LoteIngressoListEntity();
    this.vendaEntity = new VendaEntity();
    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
    // this.idLoteIngresso = navParams.get("idLoteIngresso");
    // this.qtdIngresso = navParams.get("qtdIngresso");
    this.arrayLotePagamento = navParams.get("arrayLotePagamento");
    this.loteIngressoListEntity = this.arrayLotePagamento;
  }

  ngOnInit() {
    this.findCartaoCredito();
  }

  ionViewWillEnter() {
    this.tabBarElement.style.display = 'none';
    this.events.publish('showButtonEvent:change', false);
  }

  ionViewWillLeave() {
    this.tabBarElement.style.display = 'flex';
    this.events.publish('showButtonEvent:change', true);
  }

  findCartaoCredito() {
    try {

      this.loading = this.loadingCtrl.create({
        content: '',
      });
      this.loading.present();

      this.cartaoService.findCartaoCredito()
      .then((dadosCartaoResult: CartaoCreditoEntity) => {
        this.consultaBandeira(dadosCartaoResult.tipoCartaoCreditoEnum);
        this.cartaoCreditoEntity = dadosCartaoResult;
        this.cartaoCreditoEntity.numeroCartaoCredito = dadosCartaoResult.tipoCartaoCreditoEnum + ' .... ' + dadosCartaoResult.numeroCartaoCredito;
        this.callGetDadosUsuario();
        
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

  callGetDadosUsuario() {
    try {

      this.usuarioService
        .getDadosUsuario()
        .then((dadosUsuarioDetalheResult) => {
          this.usuarioDetalheEntity = dadosUsuarioDetalheResult;
          this.loading.dismiss();
        })
        .catch(err => {
          this.errorConnection = err.message ? err.message : 'Não foi possível conectar ao servidor';
          this.loading.dismiss();
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

      // compraLoteIngresso(token, VendaEntity(qtdParcelas, ListLoteIngressoListEntity(idLoteIngresso, qtdIngresso))
      
      // this.favoritoEventoUsuarioEntity = new FavoritoEventoUsuarioEntity();
      // this.favoritoEventoUsuarioEntity.idEvento = idEvento;
      
      this.vendaEntity.qtdParcelas = 1;
      this.vendaEntity.listLoteIngressoListEntity = this.arrayLotePagamento;
      
      console.log(JSON.stringify(this.vendaEntity));

      this.pagamentoService.compraLoteIngresso(this.vendaEntity)
      .then((vendaResult: VendaEntity) => {
        console.log(vendaResult);

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

}
