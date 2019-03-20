import { LoteIngressoListEntity } from '../model/lote-ingresso-list-entity';
export class EventoDetalheEntity {

  public idEvento: number;
  public nomeEvento: string;
  public dataEventoFormat: string;
  public enderecoFormat: string;
  public descricaoEvento: string;
  public cartaoCreditoFormat: string;
  public tipoCartaoCreditoEnum: string;
  public isCartaoCredito: number;
  public isFavorito: number;
  public descricaoOrganizador: string;

  public imagemEvento: string;

  public listLoteIngressoListEntity: LoteIngressoListEntity[] = [];

  constructor(){
  }

}