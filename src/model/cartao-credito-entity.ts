export class CartaoCreditoEntity {

  public idCartaoCredito: number;
  public numeroCartaoCredito: string;
  public mesExpiracao: number;
  public anoExpiracao: number;
  public idEstado: number;
  public idCidade: number;
  public tipoCartaoCreditoEnum: string;
  public nomeTitular: string;
  public numeroLogradouro: string;
  public complemento: string;
  public endereco: string;
  public bairro: string;
  public cep: string;
  public dataNascimentoTitular: Date;
  public cpfTitular: string;
  public telefoneTitular: string;
  public titularDiferente: boolean;
  public hashCartaoCredito: string;

  constructor(){
  }

}