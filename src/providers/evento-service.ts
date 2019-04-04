import { Http, Headers, RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';
import { Constants } from '../app/constants';

@Injectable()
export class EventoService {

  private headers = new Headers({ 'Content-Type': 'application/json' });
  private options = new RequestOptions({ headers: this.headers, method: "post" });

  constructor(public _http: Http) {
  }

  public findEventosDestaqueAndCidade() {
    try {
      let token = localStorage.getItem(Constants.TOKEN_USUARIO) != null ? localStorage.getItem(Constants.TOKEN_USUARIO) : '';
      return new Promise((resolve, reject) => {
          this._http.post(Constants.API_URL + 'findEventosDestaqueAndCidade/'
          + token, this.options)
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

  public findEventosDestaqueAndCidadeProximosaMim(eventoListEntity) {
    try {
      let token = localStorage.getItem(Constants.TOKEN_USUARIO) != null ? localStorage.getItem(Constants.TOKEN_USUARIO) : '';
      return new Promise((resolve, reject) => {
          this._http.post(Constants.API_URL + 'findEventosDestaqueAndCidadeProximosaMim/'
          + token, JSON.stringify(eventoListEntity), this.options)
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

  public findAnuncioRevenda() {
    try {
      let token = localStorage.getItem(Constants.TOKEN_USUARIO) != null ? localStorage.getItem(Constants.TOKEN_USUARIO) : '';
      return new Promise((resolve, reject) => {
          this._http.post(Constants.API_URL + 'findAnuncioRevenda/'
          + token, this.options)
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

  public findEventoDetalheByIdEvento(eventoDetalheEntity) {
    try {
      return new Promise((resolve, reject) => {
          this._http.post(Constants.API_URL + 'findEventoDetalheByIdEvento/'
          + localStorage.getItem(Constants.TOKEN_USUARIO), JSON.stringify(eventoDetalheEntity), this.options)
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
  
  public findIngressoDetalheByIdEvento(eventoDetalheEntity) {
    try {
      return new Promise((resolve, reject) => {
          this._http.post(Constants.API_URL + 'findIngressoDetalheByIdEvento/'
          + localStorage.getItem(Constants.TOKEN_USUARIO), JSON.stringify(eventoDetalheEntity), this.options)
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

  public findIngressoDetalheRevendaByIdEvento(eventoDetalheEntity) {
    try {
      return new Promise((resolve, reject) => {
          this._http.post(Constants.API_URL + 'findIngressoDetalheRevendaByIdEvento/'
          + localStorage.getItem(Constants.TOKEN_USUARIO), JSON.stringify(eventoDetalheEntity), this.options)
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

  public findIngressosDisponivelByUsuario() {
    try {
      return new Promise((resolve, reject) => {
          this._http.post(Constants.API_URL + 'findIngressosDisponivelByUsuario/'
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

  public alteraCalculoLoteIngressoEvento(listLoteIngressoListEntity) {
    try {
      return new Promise((resolve, reject) => {
          this._http.post(Constants.API_URL + 'alteraCalculoLoteIngressoEvento/'
          + localStorage.getItem(Constants.TOKEN_USUARIO), JSON.stringify(listLoteIngressoListEntity), this.options)
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

  public adicionaIngressoRevenda(anuncioIngressoListEntity) {
    try {
      return new Promise((resolve, reject) => {
          this._http.post(Constants.API_URL + 'adicionaIngressoRevenda/'
          + localStorage.getItem(Constants.TOKEN_USUARIO), JSON.stringify(anuncioIngressoListEntity), this.options)
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

  public removeIngressoRevenda(anuncioIngressoListEntity) {
    try {
      return new Promise((resolve, reject) => {
          this._http.post(Constants.API_URL + 'removeIngressoRevenda/'
          + localStorage.getItem(Constants.TOKEN_USUARIO), JSON.stringify(anuncioIngressoListEntity), this.options)
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