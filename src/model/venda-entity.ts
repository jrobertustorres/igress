import { LoteIngressoListEntity } from '../model/lote-ingresso-list-entity';
export class VendaEntity {

  public idVenda: number;
  public nomeEvento: string;
  public qtdParcelas: number;
  public listLoteIngressoListEntity: LoteIngressoListEntity[] = [];
	
  constructor(){
  }

}