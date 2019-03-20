import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { HttpModule } from '@angular/http';
import { MyApp } from './app.component';
import { Device } from '@ionic-native/device/ngx';
import { MaskUtil } from '../utilitarios/mask';
import { AppVersion } from '@ionic-native/app-version/ngx';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
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

//SERVICES
import { FavoritosService } from '../providers/favoritos-service';
import { LoginService } from '../providers/login-service';
import { UsuarioService } from '../providers/usuario-service';
import { VersaoAppService } from '../providers/versao-app-service';
import { EstadosService } from './../providers/estados-service';
import { CidadesService } from '../providers/cidades-service';
import { EventoService } from '../providers/evento-service';

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
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
    TabsPage
  ],
  imports: [
    HttpModule,
    BrowserModule,
    IonicModule.forRoot(MyApp, {
      backButtonText: '',
    },
    )
  ],
  // imports: [
  //   BrowserModule,
  //   IonicModule.forRoot(MyApp)
  // ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
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
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
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
    FavoritosService,
    LoginService,
    UsuarioService,
    VersaoAppService,
    EstadosService,
    CidadesService,
    EventoService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
