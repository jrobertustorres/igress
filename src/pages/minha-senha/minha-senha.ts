import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, ToastController, Events } from 'ionic-angular';
import { FormBuilder,	FormGroup, Validators } from '@angular/forms';

//ENTITYS
import { UsuarioEntity } from '../../model/usuario-entity';

// SERVICES
import { UsuarioService } from '../../providers/usuario-service';

// PAGES
import { EditarPerfilPage } from '../editar-perfil/editar-perfil';

//UTILITARIOS
import { PasswordValidation } from '../../utilitarios/password-validation';

@IonicPage()
@Component({
  selector: 'page-minha-senha',
  templateUrl: 'minha-senha.html',
})
export class MinhaSenhaPage {
  private usuarioEntity: UsuarioEntity;
  private loading = null;
  public minhaSenhaForm: FormGroup;
  tabBarElement: any;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              public loadingCtrl: LoadingController, 
              public alertCtrl: AlertController,
              private usuarioService: UsuarioService,
              private toastCtrl: ToastController,
              public events: Events,
              private formBuilder: FormBuilder) {

    this.usuarioEntity = new UsuarioEntity();
    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
  }

  ngOnInit() {
    this.minhaSenhaForm = this.formBuilder.group({
      'senha': ['', Validators.required],
      'novaSenha': ['', Validators.required],
      'confirmSenha': ['', Validators.required]
    }, {
        validator: PasswordValidation.MatchPasswordAlterarSenha
      }
    );
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

  presentToast() {
    let toast = this.toastCtrl.create({
      message: 'Sua senha foi alterada!',
      duration: 3000,
      position: 'bottom',
      cssClass: "toast-success"
    });

    toast.onDidDismiss(() => {
    });

    toast.present();
  }

  submeterNovaSenha() {
    if (this.minhaSenhaForm.valid) {
      
      try {
        
        this.loading = this.loadingCtrl.create({
          content: 'Aguarde...'
        });
        this.loading.present();

        this.usuarioService
        .alteraSenhaUsuario(this.usuarioEntity)
        .then((usuarioEntityResult: UsuarioEntity) => {

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
      catch (err){
        if(err instanceof RangeError){
          console.log('out of range');
        }
        console.log(err);
      }
    } else {
      Object.keys(this.minhaSenhaForm.controls).forEach(campo => {
        const controle = this.minhaSenhaForm.get(campo);
        controle.markAsTouched();
      })
    }
  }

}
