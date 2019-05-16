import { Http, Headers, RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';
import { Constants } from '../app/constants';

@Injectable()
export class CartaoService {

  private headers = new Headers({ 'Content-Type': 'application/json' });
  private options = new RequestOptions({ headers: this.headers, method: "post" });

  constructor(public _http: Http) {
  }

  public adicionaEditaCartaoCredito(cartaoCreditoEntity) {
    try {
      return new Promise((resolve, reject) => {
          this._http.post(Constants.API_URL + 'adicionaEditaCartaoCredito/'
          + localStorage.getItem(Constants.TOKEN_USUARIO), JSON.stringify(cartaoCreditoEntity), this.options)
          .map(res=>res.json())
          .subscribe(data => {
            resolve(data);
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

  public findCartaoCredito() {
    try {
      return new Promise((resolve, reject) => {
          this._http.post(Constants.API_URL + 'findCartaoCredito/'
          + localStorage.getItem(Constants.TOKEN_USUARIO), this.options)
          .map(res=>res.json())
          .subscribe(data => {
            resolve(data);
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