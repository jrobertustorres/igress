import { LoteIngressoListEntity } from '../model/lote-ingresso-list-entity';
import { IngressoListEntity } from '../model/ingresso-list-entity';
export class VendaEntity {

  public idVenda: number;
  public nomeEvento: string;
  public qtdParcelas: number;
  public listLoteIngressoListEntity: LoteIngressoListEntity[] = [];
  public listIngressoListEntity: IngressoListEntity[] = [];
	
  constructor(){
  }

}