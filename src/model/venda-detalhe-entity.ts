import { ParcelaCartaoCreditoEntity } from '../model/parcela-cartao-credito-entity';
export class VendaDetalheEntity {

  public nomeEvento: string;
  public descricao: string;
  public valorTotalIngressoFormat: string;
  public listParcelaCartaoCreditoEntity: ParcelaCartaoCreditoEntity[] = [];
  
  public numeroCartaoCredito: string;
  public mesExpiracao: number;
  public anoExpiracao: number;
  public tipoCartaoCreditoEnum: string;
  
  public titularDiferente: boolean;
  public cpfTitular: string;
  public tempoMinutosTelaVenda: number;
  public qtdParcela: number;//coloquei aqui para pegar da tela e mandar no vendaEntity

  constructor(){
  }

}