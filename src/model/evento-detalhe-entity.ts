import { LoteIngressoListEntity } from '../model/lote-ingresso-list-entity';
export class EventoDetalheEntity {

  public idEvento: number;
  public idFavoritoEventoUsuario: number;
  public nomeEvento: string;
  public dataEventoFormat: string;
  public enderecoFormat: string;
  public descricaoEvento: string;
  public cartaoCreditoFormat: string;
  public tipoCartaoCreditoEnum: string;
  public cartaoCredito: number;
  public favorito: boolean;
  public descricaoOrganizador: string;

  public imagemEvento: string;
  public valorTotalIngressoFormat: string;

  public listLoteIngressoListEntity: LoteIngressoListEntity[] = [];

  constructor(){
  }

}