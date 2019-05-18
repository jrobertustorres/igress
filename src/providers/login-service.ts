import { Injectable, EventEmitter } from '@angular/core';
import 'rxjs/add/operator/map';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Events } from 'ionic-angular';
import { Constants } from '../app/constants';

//ENTITYS
import { UsuarioEntity } from '../model/usuario-entity';

@Injectable()
export class LoginService {
  private headers = new Headers({ 'Content-Type': 'application/json' });
  private options = new RequestOptions({ headers: this.headers, method: "post" });
  public userChangeEvent = new EventEmitter();
  public carrinhoChangeEvent = new EventEmitter();
  public emailPessoaChangeEvent = new EventEmitter();
  private usuarioEntity: UsuarioEntity;

  constructor(public http: Http,
              public events: Events) {
    this.usuarioEntity = new UsuarioEntity();
  }

  public login(usuarioEntity) {
    try {
      
      this.usuarioEntity = usuarioEntity;
      this.usuarioEntity.tokenPush = localStorage.getItem(Constants.TOKEN_PUSH);
      this.usuarioEntity.versaoApp = localStorage.getItem(Constants.VERSION_NUMBER);
      this.usuarioEntity.uuid = localStorage.getItem(Constants.UUID);

      return new Promise((resolve, reject) => {
        this.http.post(Constants.API_URL + 'login/', 
        JSON.stringify(this.usuarioEntity), this.options)
          .map(res=>res.json())
          .subscribe(data => {
            resolve(data);

            localStorage.setItem(Constants.TOKEN_USUARIO, data.token);
            let names = data.nomePessoa.split(" ");
            if(names[1]) {
              names = names[0] +' '+ names[1];
            } else {
              names = names[0];
            }
            localStorage.setItem(Constants.NOME_PESSOA, names);

            localStorage.setItem(Constants.EMAIL_PESSOA, data.email);
            localStorage.setItem(Constants.ID_USUARIO, data.idUsuario);
            localStorage.setItem(Constants.PUBLIC_KEY, data.publicKey);

            this.events.publish('usuarioLogadoEvent:change', data.idUsuario);
            this.userChangeEvent.emit(data.nomePessoa);
            this.emailPessoaChangeEvent.emit(data.email);

          }, (err) => {
            reject(err.json());
          });
      });

    } catch (e){
      if(e instanceof RangeError){
        console.log('out of range');
      }
    }
  }

  public loginByIdService(usuarioEntity) {
    try {
      this.usuarioEntity.tokenPush = localStorage.getItem(Constants.TOKEN_PUSH);
      this.usuarioEntity.versaoApp = localStorage.getItem(Constants.VERSION_NUMBER);
      this.usuarioEntity.uuid = localStorage.getItem(Constants.UUID);
      
      return new Promise((resolve, reject) => {
        this.http.post(Constants.API_URL + 'loginById/', 
        JSON.stringify(usuarioEntity), this.options)
          .map(res=>res.json())
          .subscribe(data => {
            resolve(data);

            localStorage.setItem(Constants.TOKEN_USUARIO, data.token);
            let names = data.nomePessoa.split(" ");
            if(names[1]) {
              names = names[0] +' '+ names[1];
            } else {
              names = names[0];
            }
            localStorage.setItem(Constants.NOME_PESSOA, names);
            localStorage.setItem(Constants.EMAIL_PESSOA, data.email);
            localStorage.setItem(Constants.ID_USUARIO, data.idUsuario);
            localStorage.setItem(Constants.PUBLIC_KEY, data.publicKey);

            this.events.publish('usuarioLogadoEvent:change', data.idUsuario);
            this.userChangeEvent.emit(data.nomePessoa);
            this.emailPessoaChangeEvent.emit(data.email);

          }, (err) => {
            reject(err.json());
          });
      });

    } catch (e){
      if(e instanceof RangeError){
        console.log('out of range');
      }
    }
  }

  public loginFacebook(usuarioEntity) {
    try {

      this.usuarioEntity = usuarioEntity;
      this.usuarioEntity.tokenPush = localStorage.getItem(Constants.TOKEN_PUSH);
      this.usuarioEntity.versaoApp = localStorage.getItem(Constants.VERSION_NUMBER);
      this.usuarioEntity.uuid = localStorage.getItem(Constants.UUID);

      return new Promise((resolve, reject) => {
        this.http.post(Constants.API_URL + 'loginByIdFacebook/', 
          JSON.stringify(this.usuarioEntity), this.options)
          .map(res=>res.json())
          .subscribe(data => {
            resolve(data);

            localStorage.setItem(Constants.TOKEN_USUARIO, data.token);
            let names = data.nomePessoa.split(" ");
            if(names[1]) {
              names = names[0] +' '+ names[1];
            } else {
              names = names[0];
            }
            localStorage.setItem(Constants.NOME_PESSOA, names);
            localStorage.setItem(Constants.EMAIL_PESSOA, data.email);
            localStorage.setItem(Constants.ID_USUARIO, data.idUsuario);
            localStorage.setItem(Constants.PUBLIC_KEY, data.publicKey);

            this.events.publish('usuarioLogadoEvent:change', data.idUsuario);
            this.userChangeEvent.emit(data.nomePessoa);
            this.emailPessoaChangeEvent.emit(data.login);
          }, (err) => {
            reject(err.json());
          });
      });

    } catch (e){
      if(e instanceof RangeError){
        console.log('out of range');
      }
    }
  }


}

