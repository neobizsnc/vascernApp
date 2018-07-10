import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { CallNumber } from '@ionic-native/call-number';
import { EmailComposer } from '@ionic-native/email-composer';
import { LaunchNavigator } from '@ionic-native/launch-navigator';

import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { MenuPage } from '../pages/menu/menu';
import { SearchPage } from '../pages/search/search';
import { FavouritePage } from '../pages/favourite/favourite';
import { SchedaPage } from '../pages/scheda/scheda';
import { SearchResultPage } from '../pages/search-result/search-result';
import { TabsPage } from '../pages/tabs/tabs';
import { HTTP } from '@ionic-native/http';
import { HttpModule } from '@angular/http';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { SearchPipe } from '../pipes/search/search';
import { SortPipe } from '../pipes/sort/sort';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { NativeStorage } from '@ionic-native/native-storage';

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    MenuPage,
    SearchPage,
    FavouritePage,
    SearchResultPage,
    SchedaPage,
    TabsPage,
    SearchPipe,
    SortPipe
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp,{
      // These options are available in ionic-angular@2.0.0-beta.2 and up.
      scrollPadding: false,
            scrollAssist: false, 
            autoFocusAssist: false
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    MenuPage,
    SearchPage,
    FavouritePage,
    SearchResultPage,
    SchedaPage,
    TabsPage  
  ],
  providers: [
    StatusBar,
    SplashScreen,
    HTTP,
    HttpModule,
    CallNumber,
    EmailComposer,
    LaunchNavigator,
    InAppBrowser,
    NativeStorage,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
