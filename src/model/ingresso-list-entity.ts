export class IngressoListEntity {

  public idIngresso: number;
  public idAnuncio : number;
  public nomeLoteIngresso: string;
  public descricaoLoteIngresso: string;
  public valorETaxaFormat: string;
  public imagemEvento: string;
  public vendaAteFormat: string;
  public tokenIngresso: string;
  public statusIngressoEnum: string;
  public statusIngressoFormat: string;
  public valorAnuncioETaxaFormat : string;

  constructor(){
  }

}