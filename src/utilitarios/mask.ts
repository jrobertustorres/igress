import {Injectable} from '@angular/core';

@Injectable()
export class MaskUtil {

  maskMoneyConvert(v) {
    v=v.replace(/\D/g,'');
    v=v.replace(/(\d{1,2})$/, ',$1');
    v=v.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
    return v;
  }

  maskPhoneConverter(tel) {
    let ifenPosition = (tel.length <= 14 && tel.length != 11) ? /(\d{4})(\d)/ : /(\d{5})(\d)/;
    tel=tel.replace(/\D/g,"");                 //Remove tudo o que não é dígito
    tel=tel.replace(/^(\d\d)(\d)/g,"($1) $2"); //Coloca parênteses em volta dos dois primeiros dígitos
    tel=tel.replace(ifenPosition,"$1-$2");    //Coloca hífen entre o quarto e o quinto dígitos
    return tel;
  }

}