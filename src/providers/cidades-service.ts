import { Http, Headers, RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Constants } from '../app/constants';

//ENTITY
import { CidadeEntity } from './../model/cidade-entity';

@Injectable()
export class CidadesService {

  private headers = new Headers({ 'Content-Type': 'application/json' });
  private options = new RequestOptions({ headers: this.headers, method: "post" });
  private cidadeEntity: CidadeEntity;

  constructor(public _http: Http) {this.cidadeEntity = new CidadeEntity();}

  public getCidades(idEstado) {
    this.cidadeEntity.idEstado = idEstado;
    
    try {

      return this._http.post(Constants.API_URL + 'findCidadeByEstado/',
        JSON.stringify(this.cidadeEntity), this.options)
        .map(res => res.json())
        .toPromise()
        .catch();

    } catch (e){
      if(e instanceof RangeError){
        console.log('out of range');
      }
    }
  }

}
