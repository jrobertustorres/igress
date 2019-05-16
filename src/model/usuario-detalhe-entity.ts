export class UsuarioDetalheEntity {
    
      public idUsuario: number;
      public idPessoa: number;
      public idCidade: number;
      public idEstado: number;
    
      public nomePessoa: string;
      public cpfPessoa: string;
      public dataNascimento: Date;
      public telefonePessoa: string;
      public tipoUsuario: string;
      public endereco: string;
      public numeroLogradouro: string;
      public complemento: string;
      public bairro: string;
      public cep: string;
      
      public emailUsuario: string;
      
      public loginUsuario: string;
      public senhaUsuario: string;
      public idUsuarioFacebook: string;
      public statusAceitoTermoUso: boolean;

      constructor(){
      }
    }
    