import { Component } from '@angular/core';
import { Platform, LoadingController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TabsPage } from '../pages/tabs/tabs';
import { TutorialPage } from '../pages/tutorial/tutorial';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core'; 
import { Globalization } from '@ionic-native/globalization';
import { LanguageactiveProvider } from '../providers/languageactive/languageactive'
import { Keyboard } from '@ionic-native/keyboard';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  // Do not set page here
  rootPage:any;
  loader: any;
 
  constructor(
    private globalization: Globalization, 
    private translate: TranslateService, 
    public loadingCtrl: LoadingController, 
    public storage: Storage, 
    platform: Platform, 
    statusBar: StatusBar, 
    splashScreen: SplashScreen,
    public lng: LanguageactiveProvider,
    public keyboard: Keyboard) {
    platform.ready().then(() => {

      this.keyboard.hideFormAccessoryBar(false);

      //SOLO DESKTOP
      this.lng.setLang("en");
      this.translate.setDefaultLang("en");
      

      this.globalization.getPreferredLanguage()
      .then(res => {
        console.log("LINGUA => ", res)
        //this.translate.setDefaultLang(res.value);
        this.lng.setLang(res.value.substring(0,2));
        this.translate.setDefaultLang(res.value.substring(0,2));
      })
      .catch(e => console.log("LINGUA ERRORE => " + e));

      // Now the native side is ready. Let's set the page.
      
      this.presentLoading();
      this.storage.get('introShown').then((result) => {
 
        if(result){
          this.rootPage = TabsPage;
        } else {
          this.rootPage = TutorialPage;
          this.storage.set('introShown', true);
        }
 
        this.loader.dismiss();

      });
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }



  presentLoading() {
 
    this.loader = this.loadingCtrl.create({
      content: "Authenticating..."
    });
 
    this.loader.present();
 
  }




}