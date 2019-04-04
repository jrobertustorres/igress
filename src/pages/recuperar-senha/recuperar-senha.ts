import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, ToastController, Events, Platform } from 'ionic-angular';
import { FormBuilder,	FormGroup, Validators } from '@angular/forms';

//ENTITYS
import { UsuarioEntity } from '../../model/usuario-entity';

//SERVICES
import { UsuarioService } from '../../providers/usuario-service';

//PAGES
import { HomePage } from '../home/home';

@IonicPage()
@Component({
  selector: 'page-recuperar-senha',
  templateUrl: 'recuperar-senha.html',
})

export class RecuperarSenhaPage implements OnInit {

  private loading: any;
  private usuarioEntity: UsuarioEntity;
  public recuperarSenhaForm: FormGroup;
  tabBarElement: any;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              public loadingCtrl: LoadingController,
              private formBuilder: FormBuilder,
              private usuarioService: UsuarioService,
              public events: Events,
              public alertCtrl: AlertController,
              public platform: Platform,
              private toastCtrl: ToastController) {

    this.usuarioEntity = new UsuarioEntity();
    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
    this.platform.registerBackButtonAction(()=>this.myHandlerFunction());

  }

  ngOnInit() {
    this.recuperarSenhaForm = this.formBuilder.group({
      'login': ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')]]
    });
  }

  ionViewDidLoad() {
  }

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
    if(this.loading) {
      this.loading.dismiss();
      this.navCtrl.pop();
    }
  }

  presentToast() {
    let toast = this.toastCtrl.create({
      message: 'Sua senha foi alterada',
      duration: 3000,
      position: 'bottom',
      cssClass: "toast-success"
    });

    toast.onDidDismiss(() => {
    });

    toast.present();
  }

  submeterRecuperarSenha() {
    try {
      if (this.recuperarSenhaForm.valid) {
        this.loading = this.loadingCtrl.create({
          content: ''
        });
        this.loading.present();

        this.usuarioService
        .recuperasenhaService(this.usuarioEntity)
        .then((usuarioEntityResult: UsuarioEntity) => {
    
          this.loading.dismiss();
          this.presentToast();
          setTimeout(() => {
            this.navCtrl.push(HomePage);
          }, 3000);
        }, (err) => {
          this.loading.dismiss();
          this.alertCtrl.create({
            subTitle: err.message,
            buttons: ['OK']
          }).present();
        });
        
      } else {
        Object.keys(this.recuperarSenhaForm.controls).forEach(campo => {
          const controle = this.recuperarSenhaForm.get(campo);
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

}
