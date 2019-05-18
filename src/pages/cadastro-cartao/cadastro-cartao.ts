import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, ToastController, Platform, ModalController } from 'ionic-angular';
import { FormBuilder,	FormGroup, Validators } from '@angular/forms';
import { MaskUtil } from "../../utilitarios/mask";
import { DatePicker } from '@ionic-native/date-picker';

import jsencrypt from 'jsencrypt';
import { MoipCreditCard } from 'moip-sdk-js';
import { MoipValidator } from 'moip-sdk-js';

//ENTITIES
import { CartaoCreditoEntity } from '../../model/cartao-credito-entity';
import { UsuarioDetalheEntity } from './../../model/usuario-detalhe-entity';

//SERVICES
import { CartaoService } from '../../providers/cartao-service';
import { UsuarioService } from '../../providers/usuario-service';
import { CidadesService } from '../../providers/cidades-service';
import { EstadosService } from '../../providers/estados-service';

// PAGES
import { EditarPerfilPage } from '../editar-perfil/editar-perfil';
import { ModalCidadesPage } from '../modal-cidades/modal-cidades';

@IonicPage()
@Component({
  selector: 'page-cadastro-cartao',
  templateUrl: 'cadastro-cartao.html',
})
export class CadastroCartaoPage {
  public cartaoForm: FormGroup;
  public dadosUsuarioCartao: any;
  private cartaoCreditoEntity: CartaoCreditoEntity;
  private usuarioDetalheEntity: UsuarioDetalheEntity;
  private loading = null;
  public telefoneTitular: any;
  public showLoading: boolean = true;
  private errorConnection: boolean = false;
  private dadosFormat: any;
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

  constructor(public navCtrl: NavController,
              private formBuilder: FormBuilder,
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController,
              private cartaoService: CartaoService,
              private usuarioService: UsuarioService,
              private toastCtrl: ToastController,
              private mask: MaskUtil,
              public platform: Platform,
              private datePicker: DatePicker,
              public modalCtrl: ModalController,
              private estadosService: EstadosService,
              private cidadesService: CidadesService,
              public navParams: NavParams) {
    this.cartaoCreditoEntity = new CartaoCreditoEntity();
    this.usuarioDetalheEntity = new UsuarioDetalheEntity();
  }

  ngOnInit() {

    this.findCartaoCredito();

    this.cartaoForm = this.formBuilder.group({
      'titularDiferente': [''],
      'numeroCartaoCredito': ['', [Validators.required, Validators.maxLength(100)]],
      'nomeTitular': ['', Validators.required],
      'anoExpiracao': ['', [Validators.required, Validators.maxLength(100)]],
      'mesExpiracao': ['', [Validators.required, Validators.maxLength(100)]],
      'cvc': ['', Validators.maxLength(50)],
      'cpfTitular': ['', Validators.required],
      'dataNascimentoTitular': ['', Validators.required],
      'telefoneTitular': ['', Validators.required],
      'endereco': ['', Validators.required],
      'bairro': ['', Validators.required],
      'numeroLogradouro': ['', Validators.required],
      'cep': ['', Validators.required],
      'complemento': [''],
      'idEstado': [''],
      'idCidade': ['']
    }
    );

    this.cartaoForm.controls.dataNascimentoTitular.disable();

    this.estadosService
      .getEstados()
      .subscribe(dados => {
      this.estados = dados;
    });

  }

  presentToast() {
    let toast = this.toastCtrl.create({
      message: 'Seu cartão foi adicionado!',
      duration: 3000,
      position: 'bottom',
      cssClass: "toast-success"
    });

    toast.onDidDismiss(() => {
    });

    toast.present();
  }

  getIdEstado(idEstado: any) {
    this.idEstado = idEstado;
  }

  showModalCidades(){
    this.idEstado = this.idEstado ? this.idEstado : this.usuarioDetalheEntity.idEstado; 
    let modal = this.modalCtrl.create(ModalCidadesPage, {idEstado: this.idEstado});

    modal.onDidDismiss((data) => {
      if (data) {
        this.idCidade = data.idCidade;
        this.dadosCidades = data;
      }
    });

    modal.present();
  }

  public selecionaDataNascTitular() {
    this.datePicker.show({
      date: new Date(),
      mode: 'date',
      okText: 'OK',
      cancelText: 'Cancelar',
      androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK
    })
    .then(dataNascimentoTitular => {
      this.dataNascimentoTitular = dataNascimentoTitular.toISOString();

    }, (err) => {
    });
  }

  getCampoTelefone(tel: any) {
    this.telefoneTitular = this.mask.maskPhoneConverter(tel);
  }

  removeFormatTel() {
    this.dadosFormat.telefoneTitular = this.cartaoForm.value.telefoneTitular.replace("(", "");
    this.dadosFormat.telefoneTitular = this.cartaoForm.value.telefoneTitular.replace(")", "");
    this.dadosFormat.telefoneTitular = this.cartaoForm.value.telefoneTitular.replace("-", "");
    this.dadosFormat.telefoneTitular = this.cartaoForm.value.telefoneTitular.replace(" ", "");
    return this.dadosFormat.telefoneTitular;
  }

  callGetDadosUsuario() {
    try {
      this.usuarioService
        .getDadosUsuario()
        .then((dadosUsuarioDetalheResult) => {
          this.usuarioDetalheEntity = dadosUsuarioDetalheResult;
          this.cartaoCreditoEntity.nomeTitular = this.usuarioDetalheEntity.nomePessoa;
          this.cartaoCreditoEntity.cpfTitular = this.usuarioDetalheEntity.cpfPessoa;
          this.cartaoCreditoEntity.endereco = this.usuarioDetalheEntity.endereco;
          this.cartaoCreditoEntity.complemento = this.usuarioDetalheEntity.complemento;
          this.cartaoCreditoEntity.bairro = this.usuarioDetalheEntity.bairro;
          this.cartaoCreditoEntity.cep = this.usuarioDetalheEntity.cep;
          this.cartaoCreditoEntity.telefoneTitular = this.usuarioDetalheEntity.telefonePessoa;
          this.cartaoCreditoEntity.numeroLogradouro = this.usuarioDetalheEntity.numeroLogradouro;
          this.cartaoCreditoEntity.idEstado = this.usuarioDetalheEntity.idEstado;
          this.idEstado = this.usuarioDetalheEntity.idEstado;
          this.dataNascimentoTitular = this.usuarioDetalheEntity.dataNascimento ? new Date(this.usuarioDetalheEntity.dataNascimento).toJSON().split('T')[0] : null;
          
          if (this.cartaoCreditoEntity.telefoneTitular) {
            this.telefoneTitular = this.mask.maskPhoneConverter(this.cartaoCreditoEntity.telefoneTitular);
          }
          if(dadosUsuarioDetalheResult.idEstado) {
            this.getCidadesByEstadoUsuario(dadosUsuarioDetalheResult.idEstado);
          } else {
            this.loading.dismiss();
          }

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

  getCidadesByEstadoUsuario(idEstado: any) {
    try {

      this.cidadesService
        .getCidades(idEstado)
        .then((listCidadesResult) => {
          this.cidades = listCidadesResult;

          for (let cidade of this.cidades) {
            if (cidade.idCidade == this.usuarioDetalheEntity.idCidade || cidade.idCidade == this.usuarioDetalheEntity.idCidade) {
              this.dadosCidades = cidade; 
            }
          }
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

  findCartaoCredito() {
    try {

      this.loading = this.loadingCtrl.create({
        content: '',
      });
      this.loading.present();

      this.cartaoService.findCartaoCredito()
      .then((dadosCartaoResult: CartaoCreditoEntity) => {
        if(dadosCartaoResult.tipoCartaoCreditoEnum) {
          this.consultaBandeira(dadosCartaoResult.tipoCartaoCreditoEnum);
          this.cartaoCreditoEntity.numeroCartaoCredito = dadosCartaoResult.tipoCartaoCreditoEnum + ' .... ' + dadosCartaoResult.numeroCartaoCredito;
          this.cartaoCreditoEntity.mesExpiracao = dadosCartaoResult.mesExpiracao;
          this.cartaoCreditoEntity.anoExpiracao = dadosCartaoResult.anoExpiracao;
        }
        
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

  submeterCartao() {
    // if (this.cartaoForm.valid) {
      let dataNascimentoTitular = new Date(this.dataNascimentoTitular);
      this.cartaoCreditoEntity.dataNascimentoTitular = dataNascimentoTitular;
      this.cartaoCreditoEntity.hashCartaoCredito = this.hashCartaoCredito;
      
      let numero = this.cartaoCreditoEntity.numeroCartaoCredito.slice(-4);
      this.cartaoCreditoEntity.numeroCartaoCredito = numero;

      this.cartaoCreditoEntity.tipoCartaoCreditoEnum = this.bandeira;
      this.cartaoCreditoEntity.idCidade = this.usuarioDetalheEntity.idCidade;

      try {
        
        this.loading = this.loadingCtrl.create({
          content: ''
        });
        this.loading.present();

        this.cartaoService
        .adicionaEditaCartaoCredito(this.cartaoCreditoEntity)
        .then((cartaoEntityResult: CartaoCreditoEntity) => {

          this.loading.dismiss();
          this.presentToast();
          setTimeout(() => {
            this.navCtrl.pop();
            // this.navCtrl.setRoot(EditarPerfilPage);
          }, 3000);
    
        }, (err) => {
          this.loading.dismiss();
          this.alertCtrl.create({
            subTitle: err.message,
            buttons: ['OK']
            // buttons: [
            //   {
            //     text: 'OK',
            //     handler: () => {
            //       this.loading.dismiss();
            //     }
            //   }
            // ]
          }).present();
        });
      }
      catch (err){
        if(err instanceof RangeError){
          console.log('out of range');
        }
        console.log(err);
      }
    // } else {
    //   Object.keys(this.cartaoForm.controls).forEach(campo => {
    //     const controle = this.cartaoForm.get(campo);
    //     controle.markAsTouched();
    //   })
    // }
  }

  consultaBandeira(tipoCartaoCreditoEnum) {
    let resposta;
    // if(!tipoCartaoCreditoEnum) {
    if(this.cartaoCreditoEntity.numeroCartaoCredito) {
      resposta = MoipValidator.cardType(this.cartaoCreditoEntity.numeroCartaoCredito);
      resposta = resposta.brand;
    } else {
      resposta = tipoCartaoCreditoEnum;
    }

    switch(resposta) { 
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

  validaDadosCartao(cvc) {

    if (this.cartaoForm.valid) {
      if(MoipValidator.isValidNumber(this.cartaoCreditoEntity.numeroCartaoCredito)) {
        this.numeroInvalido = false;      
      } else {
        this.numeroInvalido = true;      
      }
      
      if(MoipValidator.isSecurityCodeValid(this.cartaoCreditoEntity.numeroCartaoCredito, cvc)) {
        this.codigoSegurancaInvalido = false;      
      } else {
        this.codigoSegurancaInvalido = true;
      }
      
      if(MoipValidator.isExpiryDateValid(this.cartaoCreditoEntity.mesExpiracao, this.cartaoCreditoEntity.anoExpiracao)) {
        this.dataExpiracaoInvalida = false;
      } else {
        this.dataExpiracaoInvalida = true;
      }
  
      if(!this.numeroInvalido && !this.codigoSegurancaInvalido && !this.dataExpiracaoInvalida) {
        this.geraHash(cvc);
      }

    } else {
      Object.keys(this.cartaoForm.controls).forEach(campo => {
        const controle = this.cartaoForm.get(campo);
        controle.markAsTouched();
      })
    }
  }

  checkTitularDiferente(event: any) {
    if(event.checked) {
      this.cartaoForm.reset();
    }
  }

  geraHash(cvc) {
    this.loading = this.loadingCtrl.create({
      content: ''
    });
    this.loading.present();

    MoipCreditCard
    .setEncrypter(jsencrypt, 'ionic')
    .setPubKey('MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEApawl/FaZb45lUGjO+tQO'+
      'Zila1suwEWhG5LCCTRAIliDfpTyASjkYCb4XHt9YBsOuMkUob0pocD0DwQuQHk2i'+
      '/GZ6oSDXeBHuYbUvk9xRixqB65K9pjReqwTALGwfVF3x0XkKYyaENMde2iF6ta/6'+
      'AnV6Xnx8ykPW4BlnTyOufE02zBxbsQvEnlsJk88n4v9XJa7Y/I1s6g0vGxk+LRgX'+
      'lYlxE7XJZnyRd1vuIIrKkMlhD+orwEZB+GM7AEzQg50jwjn9Gk9LGGhcmiiSRc+T'+
      'ErD0GbHnxncHUctrWCQDP4BfV8IvbFOmhhottwxqPOLcDqBP1j1iAXUSIpwK3gDy'+
      'lwIDAQAB')
      .setCreditCard({
          number: this.cartaoCreditoEntity.numeroCartaoCredito,
          cvc: cvc,
          expirationMonth: this.cartaoCreditoEntity.mesExpiracao,
          expirationYear: this.cartaoCreditoEntity.anoExpiracao
      })
      .hash()
      .then((hash) => {
        this.hashCartaoCredito = hash;
        this.submeterCartao();
        // this.loading.dismiss();
      });
      // .then(hash => console.log('hash', hash));

  }

}
