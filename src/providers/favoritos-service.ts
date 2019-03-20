import { Http, Headers, RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';
import { Constants } from '../app/constants';

@Injectable()
export class FavoritosService {

  private headers = new Headers({ 'Content-Type': 'application/json' });
  private options = new RequestOptions({ headers: this.headers, method: "post" });

  constructor(public _http: Http) {
  }

  public getFavoritos() {
    try {
      return new Promise((resolve, reject) => {
          this._http.post(Constants.API_URL + 'findFavoritosByUsuario/'
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

  public adicionaFavoritos(favorito) {
    try {
      return new Promise((resolve, reject) => {
          this._http.post(Constants.API_URL + 'adicionaFavoritos/'
          + localStorage.getItem(Constants.TOKEN_USUARIO), JSON.stringify(favorito), this.options)
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

  public removerFavoritos(favorito) {
    try {
      return new Promise((resolve, reject) => {
          this._http.post(Constants.API_URL + 'removeFavoritos/'
          + localStorage.getItem(Constants.TOKEN_USUARIO), JSON.stringify(favorito), this.options)
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