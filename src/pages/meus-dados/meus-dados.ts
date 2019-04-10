import { Component, OnInit, EventEmitter } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController, ToastController, ModalController, Events } from 'ionic-angular';
import { Constants } from '../../app/constants';
import { FormBuilder,	FormGroup, Validators } from '@angular/forms';
import { MaskUtil } from "../../utilitarios/mask";

//UTILITARIOS
import { PasswordValidation } from '../../utilitarios/password-validation';

//ENTITYS
import { UsuarioEntity } from '../../model/usuario-entity';
import { UsuarioDetalheEntity } from './../../model/usuario-detalhe-entity';

//PAGES
import { ModalCidadesPage } from '../modal-cidades/modal-cidades';
import { EditarPerfilPage } from '../editar-perfil/editar-perfil';

// SERVICES
import { UsuarioService } from '../../providers/usuario-service';
import { EstadosService } from '../../providers/estados-service';
import { CidadesService } from '../../providers/cidades-service';

// @IonicPage()
@Component({
  selector: 'page-meus-dados',
  templateUrl: 'meus-dados.html',
})
export class MeusDadosPage implements OnInit {
  public userChangeEvent = new EventEmitter();
  private errorConnection: string;
  // public showLoading: boolean = true;
  public dadosUsuarioForm: FormGroup;
  private usuarioDetalheEntity: UsuarioDetalheEntity;
  private usuarioEntity: UsuarioEntity;
  private loading = null;
  private isReadOnly: boolean;

  private idUsuario: any;
  tabBarElement: any;

  public idCidade: any;
  public cidade: string;
  public dadosCidades = {'idCidade': this.idCidade, 'cidade': this.cidade};
  public idEstado: number;

  private estados = [];
  private cidades: any = [];

  public telefonePessoa: any;
  private dadosFormat: any;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController,
              private usuarioService: UsuarioService,
              public events: Events,
              private formBuilder: FormBuilder,
              private estadosService: EstadosService,
              private cidadesService: CidadesService,
              private mask: MaskUtil,
              private toastCtrl: ToastController,
              public modalCtrl: ModalController) {

    this.usuarioDetalheEntity = new UsuarioDetalheEntity();
    this.usuarioEntity = new UsuarioEntity();
    this.idUsuario = localStorage.getItem(Constants.ID_USUARIO);
    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
  }

  ngOnInit() {

    this.dadosUsuarioForm = this.formBuilder.group({
      'nomePessoa': ['', [Validators.required, Validators.maxLength(100)]],
      'emailUsuario': ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')]],
      'telefonePessoa': ['', Validators.maxLength(50)],
      'idEstado': [''],
      'idCidade': [''],
      'senhaUsuario': [''],
      'confirmSenha': ['']
    }, {
        validator: PasswordValidation.MatchPassword
      }
    );

    this.estadosService
      .getEstados()
      .subscribe(dados => {
      this.estados = dados;
      // this.showLoading = false;
    });

    if(!localStorage.getItem(Constants.TOKEN_USUARIO)){
      this.isReadOnly = false;
      this.dadosUsuarioForm.get('senhaUsuario').setValidators([Validators.required]);
    }
    else if(localStorage.getItem(Constants.TOKEN_USUARIO)) {
      this.isReadOnly = true;
        this.callGetDadosUsuario();
    }

  }

  ionViewDidLoad() {}

  ionViewWillEnter() {
    this.tabBarElement.style.display = 'none';
    this.events.publish('showButtonEvent:change', false);
  }
    
  ionViewWillLeave() {
    this.tabBarElement.style.display = 'flex';
    this.events.publish('showButtonEvent:change', true);
  }

  // se o loading estiver ativo, permite fechar o loading e voltar à tela anterior
  myHandlerFunction(){
    // if(this.showLoading || this.loading) {
      // this.showLoading = this.showLoading ? this.showLoading : false;
      this.loading ? this.loading.dismiss() : '';
      this.navCtrl.pop();
    // }
  }

  getIdEstado(idEstado: any) {
    this.idEstado = idEstado;
  }

  presentToast() {
    let toast = this.toastCtrl.create({
      message: 'O cadastro foi atualizado',
      duration: 3000,
      position: 'bottom',
      cssClass: "toast-success"
    });

    toast.onDidDismiss(() => {
    });

    toast.present();
  }

  getCampoTelefone(tel: any) {
    this.telefonePessoa = this.mask.maskPhoneConverter(tel);
  }

  removeFormatTel() {
    this.dadosFormat.telefonePessoa = this.dadosUsuarioForm.value.telefonePessoa.replace("(", "");
    this.dadosFormat.telefonePessoa = this.dadosUsuarioForm.value.telefonePessoa.replace(")", "");
    this.dadosFormat.telefonePessoa = this.dadosUsuarioForm.value.telefonePessoa.replace("-", "");
    this.dadosFormat.telefonePessoa = this.dadosUsuarioForm.value.telefonePessoa.replace(" ", "");
    return this.dadosFormat.telefonePessoa;
  }

  showModalCidades(){
    let modal = this.modalCtrl.create(ModalCidadesPage, {idEstado: this.idEstado});

    modal.onDidDismiss((data) => {
      if (data) {
        this.idCidade = data.idCidade;
        this.dadosCidades = data;
      }
    });

    modal.present();
  }

  submeterDadosUsuario() {
    try {

      if (this.dadosUsuarioForm.valid) {
        this.loading = this.loadingCtrl.create({
          content: '',
        });
        this.loading.present();

        if(!localStorage.getItem(Constants.TOKEN_USUARIO)){
          this.cadastraUsuario();
        }
        else if(localStorage.getItem(Constants.TOKEN_USUARIO)) {
          this.editaUsuario();
        }
      } else {
        Object.keys(this.dadosUsuarioForm.controls).forEach(campo => {
          const controle = this.dadosUsuarioForm.get(campo);
          controle.markAsTouched();
        })
      }
    }
    catch (err){
      if(err instanceof RangeError){
        console.log('out of range');
      }
      console.log(err);
    }
  }

  cadastraUsuario() {
    this.dadosFormat = this.dadosUsuarioForm.value;
    this.dadosFormat.idCidade = this.idCidade;

    this.usuarioService
    .adicionaUsuario(this.dadosFormat)
    .then((usuarioEntityResult: UsuarioEntity) => {

      this.loading.dismiss();
      this.events.publish('usuarioLogadoEvent:change', true);
      this.navCtrl.popToRoot().then(() => {
        this.navCtrl.parent.select(0).then(() => {
        });
      });
    }, (err) => {
      this.loading.dismiss();
      this.alertCtrl.create({
        subTitle: err.message,
        buttons: ['OK']
      }).present();
    });
  }

  editaUsuario() {
    this.dadosFormat = this.dadosUsuarioForm.value;
    this.dadosFormat.idCidade = this.dadosCidades.idCidade;
    this.removeFormatTel();

    this.usuarioService
    .editaUsuario(this.dadosFormat)
    .then((usuarioDetalheEntityResult: UsuarioDetalheEntity) => {
      this.events.publish('atualizaNomeEvent:change', usuarioDetalheEntityResult.nomePessoa);

      this.loading.dismiss();
      this.presentToast();
      setTimeout(() => {
        this.navCtrl.setRoot(EditarPerfilPage);
      }, 3000);
    }, (err) => {
      this.loading.dismiss();
      this.alertCtrl.create({
        subTitle: err.message,
        buttons: ['OK']
      }).present();
    });

  }

  callGetDadosUsuario() {
    try {
      this.loading = this.loadingCtrl.create({
        content: '',
      });
      this.loading.present();

      this.usuarioService
        .getDadosUsuario()
        .then((dadosUsuarioDetalheResult) => {
          this.usuarioDetalheEntity = dadosUsuarioDetalheResult;

          if (this.usuarioDetalheEntity.telefonePessoa) {
            this.telefonePessoa = this.mask.maskPhoneConverter(this.usuarioDetalheEntity.telefonePessoa);
          }

          this.getCidadesByEstadoUsuario(dadosUsuarioDetalheResult.idEstado);
        })
        .catch(err => {
          this.errorConnection = err.message ? err.message : 'Não foi possível conectar ao servidor';
          this.loading.dismiss();
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
          // this.showLoading = false;
          this.loading.dismiss();
        })
        .catch(err => {
          this.errorConnection = err.message ? err.message : 'Não foi possível conectar ao servidor';
          this.loading.dismiss(); 
          // this.showLoading = false;
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

}
