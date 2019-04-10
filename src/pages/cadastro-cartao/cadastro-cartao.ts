import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, ToastController } from 'ionic-angular';
import { FormBuilder,	FormGroup, Validators } from '@angular/forms';
import { Constants } from '../../app/constants';

//ENTITIES
import { CartaoCreditoEntity } from '../../model/cartao-credito-entity';

//SERVICES
import { CartaoService } from '../../providers/cartao-service';

// PAGES
import { EditarPerfilPage } from '../editar-perfil/editar-perfil';

@IonicPage()
@Component({
  selector: 'page-cadastro-cartao',
  templateUrl: 'cadastro-cartao.html',
})
export class CadastroCartaoPage {
  public cartaoForm: FormGroup;
  private cartaoCreditoEntity: CartaoCreditoEntity;
  private loading = null;

  constructor(public navCtrl: NavController,
              private formBuilder: FormBuilder,
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController,
              private cartaoService: CartaoService,
              private toastCtrl: ToastController,
              public navParams: NavParams) {
    this.cartaoCreditoEntity = new CartaoCreditoEntity();
  }

  ngOnInit() {

    this.cartaoForm = this.formBuilder.group({
      'numeroCartao': ['', [Validators.required, Validators.maxLength(100)]],
      'nomeTitular': ['', Validators.required],
      'validade': ['', [Validators.required, Validators.maxLength(100)]],
      'cvv': ['', Validators.maxLength(50)],
      'cpfTitular': ['', Validators.required],
      'datanascimento': ['', Validators.required],
      'telefone': ['', Validators.required],
    }
    );
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

  submeterCartao() {
    if (this.cartaoForm.valid) {
      
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
      Object.keys(this.cartaoForm.controls).forEach(campo => {
        const controle = this.cartaoForm.get(campo);
        controle.markAsTouched();
      })
    }
  }

}
