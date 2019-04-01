export class AnuncioIngressoListEntity {

  public idAnuncio: number;
  public idIngresso: number;
  public nomeLoteIngresso: string;
  public descricaoLoteIngresso: string;
  public valorETaxaFormat: string;
  public valorAnuncio: string;

  public listAnuncioIngressoListEntity: AnuncioIngressoListEntity[] = [];

  constructor(){
  }

}