import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { HttpModule } from '@angular/http';
import { MyApp } from './app.component';
import { Device } from '@ionic-native/device';
import { MaskUtil } from '../utilitarios/mask';
import { AppVersion } from '@ionic-native/app-version';
import { NgxQRCodeModule } from 'ngx-qrcode2';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Network } from '@ionic-native/network';
import { Geolocation } from '@ionic-native/geolocation';
import { BrMaskerModule } from 'brmasker-ionic-3';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { EmailComposer } from '@ionic-native/email-composer';
import { Diagnostic } from '@ionic-native/diagnostic';
// import { TooltipsModule, TooltipController } from 'ionic-tooltips';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TooltipsModule } from 'ionic-tooltips';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DatePicker } from '@ionic-native/date-picker';
import { Facebook } from '@ionic-native/facebook';

// import jsencrypt from 'jsencrypt';
// import { MoipCreditCard } from 'moip-sdk-js';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

//PAGES
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { FavoritosListPage } from '../pages/favoritos-list/favoritos-list';
import { PerfilPage } from '../pages/perfil/perfil';
import { MeusDadosPage } from '../pages/meus-dados/meus-dados';
import { LoginPage } from '../pages/login/login';
import { RecuperarSenhaPage } from '../pages/recuperar-senha/recuperar-senha';
import { MinhaSenhaPage } from '../pages/minha-senha/minha-senha';
import { DetalheEventoPage } from '../pages/detalhe-evento/detalhe-evento';
import { MeusIngressosListPage } from '../pages/meus-ingressos-list/meus-ingressos-list';
import { ModalQrcodePage } from '../pages/modal-qrcode/modal-qrcode';
import { EditarPerfilPage } from '../pages/editar-perfil/editar-perfil';
import { ModalCidadesPage } from '../pages/modal-cidades/modal-cidades';
import { AnuncioRevendaListPage } from '../pages/anuncio-revenda-list/anuncio-revenda-list';
import { CadastroCartaoPage } from '../pages/cadastro-cartao/cadastro-cartao';
import { ModalEntrarCadastrarPage } from '../pages/modal-entrar-cadastrar/modal-entrar-cadastrar';
import { PagamentoPage } from '../pages/pagamento/pagamento';

//ENTITIES
import { UsuarioEntity } from '../model/usuario-entity';
import { UsuarioDetalheEntity } from '../model/usuario-detalhe-entity';
import { FavoritoEntity } from '../model/favorito-entity';
import { VersaoAppEntity } from '../model/versao-app-entity';
import { EstadoEntity } from './../model/estado-entity';
import { CidadeEntity } from './../model/cidade-entity';
import { EventoListEntity } from '../model/evento-list-entity';
import { EventoDetalheEntity } from '../model/evento-detalhe-entity';
import { LoteIngressoListEntity } from '../model/lote-ingresso-list-entity';
import { FavoritoEventoUsuarioEntity } from '../model/favorito-evento-usuario-entity';
import { IngressoListEntity } from '../model/ingresso-list-entity';
import { AnuncioIngressoListEntity } from '../model/anuncio-ingresso-list-entity';
import { CartaoCreditoEntity } from '../model/cartao-credito-entity';
import { VendaEntity } from '../model/venda-entity';
import { ParcelaCartaoCreditoEntity } from '../model/parcela-cartao-credito-entity';
import { VendaDetalheEntity } from '../model/venda-detalhe-entity';

//SERVICES
import { FavoritosService } from '../providers/favoritos-service';
import { LoginService } from '../providers/login-service';
import { UsuarioService } from '../providers/usuario-service';
import { VersaoAppService } from '../providers/versao-app-service';
import { EstadosService } from './../providers/estados-service';
import { CidadesService } from '../providers/cidades-service';
import { EventoService } from '../providers/evento-service';
import { CartaoService } from '../providers/cartao-service';
import { PagamentoService } from '../providers/pagamento-service';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    FavoritosListPage,
    PerfilPage,
    MeusDadosPage,
    LoginPage,
    RecuperarSenhaPage,
    MinhaSenhaPage,
    DetalheEventoPage,
    MeusIngressosListPage,
    ModalQrcodePage,
    EditarPerfilPage,
    ModalCidadesPage,
    AnuncioRevendaListPage,
    CadastroCartaoPage,
    ModalEntrarCadastrarPage,
    PagamentoPage,
    TabsPage
  ],
  imports: [
    HttpModule,
    BrowserModule,
    BrMaskerModule,
    NgxQRCodeModule,
    BrowserAnimationsModule,
    TooltipsModule.forRoot(),
    IonicModule.forRoot(MyApp, {
      backButtonText: '',
    },
    ),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    FavoritosListPage,
    PerfilPage,
    MeusDadosPage,
    LoginPage,
    RecuperarSenhaPage,
    MinhaSenhaPage,
    DetalheEventoPage,
    MeusIngressosListPage,
    ModalQrcodePage,
    EditarPerfilPage,
    ModalCidadesPage,
    AnuncioRevendaListPage,
    CadastroCartaoPage,
    ModalEntrarCadastrarPage,
    PagamentoPage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    // TooltipController,
    DatePicker,
    Facebook,
    Network,
    Geolocation,
    Diagnostic,
    LocationAccuracy,
    EmailComposer,
    BarcodeScanner,
    Device,
    AppVersion,
    MaskUtil,
    UsuarioEntity,
    UsuarioDetalheEntity,
    FavoritoEntity,
    VersaoAppEntity,
    EstadoEntity,
    CidadeEntity,
    EventoListEntity,
    EventoDetalheEntity,
    LoteIngressoListEntity,
    FavoritoEventoUsuarioEntity,
    IngressoListEntity,
    AnuncioIngressoListEntity,
    CartaoCreditoEntity,
    VendaEntity,
    ParcelaCartaoCreditoEntity,
    VendaDetalheEntity,
    FavoritosService,
    LoginService,
    UsuarioService,
    VersaoAppService,
    EstadosService,
    CidadesService,
    EventoService,
    CartaoService,
    PagamentoService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
