import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { MyApp } from './app.component';
import { EmailComposer } from '@ionic-native/email-composer';
import { LaunchNavigator } from '@ionic-native/launch-navigator';
import { Keyboard } from '@ionic-native/keyboard';

import { AboutPage } from '../pages/about/about';
import { CreditsPage } from '../pages/credits/credits';
import { TutorialPage } from '../pages/tutorial/tutorial';
import { TutorialInactivePage } from '../pages/tutorial-inactive/tutorial-inactive';
import { MembersPage } from '../pages/members/members';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { MenuPage } from '../pages/menu/menu';
import { SearchPage } from '../pages/search/search';
import { FavouritePage } from '../pages/favourite/favourite';
import { SchedaPage } from '../pages/scheda/scheda';
import { RelatedPage } from '../pages/related/related';
import { SearchResultPage } from '../pages/search-result/search-result';
import { TabsPage } from '../pages/tabs/tabs';
import { HTTP } from '@ionic-native/http';
import { HttpModule } from '@angular/http';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { SearchPipe } from '../pipes/search/search';
import { SortPipe } from '../pipes/sort/sort';
import { TruncatePipe } from '../pipes/truncate/truncate';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { NativeStorage } from '@ionic-native/native-storage';
import { UniqueDeviceID } from '@ionic-native/unique-device-id';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Globalization } from '@ionic-native/globalization';
import { LanguageactiveProvider } from '../providers/languageactive/languageactive';
import { CallNumber } from '@ionic-native/call-number';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    TutorialPage,
    TutorialInactivePage,
    CreditsPage,
    ContactPage,
    MembersPage,
    HomePage,
    MenuPage,
    SearchPage,
    FavouritePage,
    RelatedPage,
    SearchResultPage,
    SchedaPage,
    TabsPage,
    SearchPipe,
    SortPipe,
    TruncatePipe
  ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule, // <--- add this
    TranslateModule.forRoot({ // <--- add this
      loader: { // <--- add this 
        provide: TranslateLoader, // <--- add this
        useFactory: (createTranslateLoader),  // <--- add this
        deps: [HttpClient] // <--- add this
      } // <--- add this
    }),
    IonicModule.forRoot(MyApp,{
      // These options are available in ionic-angular@2.0.0-beta.2 and up.
      scrollPadding: false,
      scrollAssist: false, 
      autoFocusAssist: false,
      swipeBackEnabled: false
    }),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    CreditsPage,
    TutorialPage,
    TutorialInactivePage,
    ContactPage,
    HomePage,
    MembersPage,
    MenuPage,
    SearchPage,
    RelatedPage,
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
    EmailComposer,
    LaunchNavigator,
    InAppBrowser,
    NativeStorage,
    UniqueDeviceID,
    Keyboard,
    Globalization,
    CallNumber,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    LanguageactiveProvider
  ]
})
export class AppModule {}
