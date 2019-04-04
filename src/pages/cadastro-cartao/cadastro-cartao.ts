import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder,	FormGroup, Validators } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-cadastro-cartao',
  templateUrl: 'cadastro-cartao.html',
})
export class CadastroCartaoPage {
  public cartaoForm: FormGroup;

  constructor(public navCtrl: NavController,
              private formBuilder: FormBuilder,
              public navParams: NavParams) {
  }

  ngOnInit() {

    this.cartaoForm = this.formBuilder.group({
      'numeroCartao': ['', [Validators.required, Validators.maxLength(100)]],
      'validade': ['', [Validators.required, Validators.maxLength(100)]],
      'cvv': ['', Validators.maxLength(50)],
      'nomeTitular': [''],
      'cpf': [''],
    }
    );
  }

}
