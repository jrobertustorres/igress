export class CartaoCreditoEntity {

  public idCartaoCredito: number;
  public numeroCartaoCredito: string;
  public mesExpiracao: number;
  public anoExpiracao: number;
  public tipoCartaoCreditoEnum: string;
  public nomeTitular: number;
  public dataNascimentoTitular: Date;
  public cpfTitular: string;
  public telefoneTitular: string;
  public titularDiferente: string;
  public hashCartaoCredito: string;

  constructor(){
  }

}