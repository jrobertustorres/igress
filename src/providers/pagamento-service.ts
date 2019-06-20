import { Http, Headers, RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';
import { Constants } from '../app/constants';

//ENTITIES
import { VendaEntity } from '../model/venda-entity';

@Injectable()
export class PagamentoService {

  private headers = new Headers({ 'Content-Type': 'application/json' });
  private options = new RequestOptions({ headers: this.headers, method: "post" });

  constructor(public _http: Http) {
  }

  public findTipoPagamentoFornecedorByFornecedor(tipoPagamentoFornecedorEntity) {
    try {

      return new Promise((resolve, reject) => {
          this._http.post(Constants.API_URL + 'findTipoPagamentoFornecedorByFornecedor/'
          + localStorage.getItem(Constants.TOKEN_USUARIO), JSON.stringify(tipoPagamentoFornecedorEntity), this.options)
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

  public compraIngresso(vendaEntity: VendaEntity, telaRevenda: boolean) {
    try {

      let servico = telaRevenda ? 'compraRevendaIngresso/' : 'compraLoteIngresso/';

      return new Promise((resolve, reject) => {
          this._http.post(Constants.API_URL + servico
          + localStorage.getItem(Constants.TOKEN_USUARIO), JSON.stringify(vendaEntity), this.options)
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

  // public compraRevendaIngresso(vendaEntity: VendaEntity) {
  //   try {

  //     return new Promise((resolve, reject) => {
  //         this._http.post(Constants.API_URL + 'compraRevendaIngresso/'
  //         + localStorage.getItem(Constants.TOKEN_USUARIO), JSON.stringify(vendaEntity), this.options)
  //         .map(res=>res.json())
  //         .subscribe(data => {
  //           resolve(data);
  //         }, (err) => {
  //           reject(err.json());
  //         });
  //     });

  //   } catch (e){
  //     if(e instanceof RangeError){
  //       console.log('out of range');
  //     }
  //   }
  // }

  public findVendaDetalheByLoteIngresso(vendaEntity: VendaEntity) {
    try {

      return new Promise((resolve, reject) => {
          this._http.post(Constants.API_URL + 'findVendaDetalheByLoteIngresso/'
          + localStorage.getItem(Constants.TOKEN_USUARIO), JSON.stringify(vendaEntity), this.options)
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