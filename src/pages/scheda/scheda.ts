import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, Platform, AlertController, } from 'ionic-angular';
import { EmailComposer } from '@ionic-native/email-composer';
import { LaunchNavigator } from '@ionic-native/launch-navigator';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map'
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { NativeStorage } from '@ionic-native/native-storage';
import { RelatedPage } from '../related/related';
import { UniqueDeviceID } from '@ionic-native/unique-device-id';
import { Globalization } from '@ionic-native/globalization';
import { LanguageactiveProvider } from '../../providers/languageactive/languageactive';
import {TranslateService} from '@ngx-translate/core';
import { CallNumber } from '@ionic-native/call-number';
/**
 * Generated class for the SchedaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-scheda',
  templateUrl: 'scheda.html',
}) 
export class SchedaPage {

  information: any[]; 
  structure: any;
  favourite: any[] = [];
  isFavourite: boolean = false;
  diseaseHcp: any[];
  diseaseAssociation: any[];
  operatingSystem: any;
  uuid: any;

  constructor(public callNumber: CallNumber, public translate: TranslateService, public lng: LanguageactiveProvider, private globalization: Globalization, private uniqueDeviceID: UniqueDeviceID, private alertCtrl: AlertController, public platform: Platform, public nativeStorage: NativeStorage, private iab: InAppBrowser, private launchNavigator: LaunchNavigator, private emailComposer: EmailComposer, public navCtrl: NavController, public navParams: NavParams, public http: Http, public viewCtrl: ViewController) {
   

    this.globalization.getPreferredLanguage()
      .then(res => {
          var filename = "structure-" + res.value.substring(0,2) + ".json";
          let localData = http.get('assets/' + filename).map(res => res.json().items);
          localData.subscribe(data => {
            this.information = data;
          });
      })
      .catch(e => {
        let localData = http.get('assets/structure-en.json').map(res => res.json().items);
        localData.subscribe(data => {
          this.information = data;
        });
      });
   
    


    platform.ready().then((readySource) => { 
      if(platform.is('ios')) {
        this.operatingSystem = "ios";
      } else {
        this.operatingSystem = "android";
      }
    });
    this.structure = this.navParams.get('structure');
    console.log(this.structure)
    this.uniqueDeviceID.get().then((uuid: any) => {
      this.uuid = uuid;
      this.chekFavorite();
    }).catch((error: any) => console.log(error));
    
  }

  toggleSection(i) {
    this.information[i].open = !this.information[i].open;
  }
 
  toggleItem(i, j) {
    this.information[i].children[j].open = !this.information[i].children[j].open;
  }

  ionViewDidLoad() {
    this.structure = this.navParams.get('structure')
    this.getDisease()
  }

  getDisease() {
    if(this.structure.type != "association") {
      this.http.get('http://vascern.azurewebsites.net/api/DiseasesApi/GetDiseaseHcpByCenterId/' + this.structure.hcpCenterId + '/english').map(res => res.json()).subscribe(data => {
        this.diseaseHcp = data;
      });
    } else {
      //'/' + this.lng.languageActive
      this.http.get('http://vascern.azurewebsites.net/api/DiseasesApi/GetDiseaseAssociationByCenterId/' + this.structure.associationId + '/english').map(res => res.json()).subscribe(data => {
        this.diseaseHcp = data;
      });
    }
  }

  call(number) {
    this.callNumber.callNumber(number, false);
  } 

  email(em) {
    let email = {
      to: em,
      subject: '',
      body: '',
      isHtml: true
    };
    this.emailComposer.open(email);
  }

  maps(address, zipcode, city, country) {
    this.launchNavigator.navigate(address + " " + zipcode + " " + city + " " + country)
      .then(
        success => console.log('Launched navigator'),
        error => console.log('Error launching navigator', error)
      );
  }

  close() {
    this.viewCtrl.dismiss();
  }

  openBrowser(link) {
    const browser = this.iab.create(link);
    browser.show()
  }


  chekFavorite() {
    var id = this.structure.type == "association" ? this.structure.associationId : this.structure.hcpCenterId;
    this.http.get('http://vascern.azurewebsites.net/api/FavaritesApi/ChekOnlyFavorites/' + this.uuid + "/" + id + "/" + this.structure.type + "?" + Math.random().toString(36)).map(res => res.json()).subscribe(data => {
      console.log(data)  
      if(data) {      
        this.isFavourite = true;
      } else {
        this.isFavourite = false;
      }
    });
  }

  addRemoveFavourite(structure) {
    var pop3 = ""
    var pop4 = ""
    var pop5 = ""
    this.translate.get('pop3').subscribe((res: string) => {
      pop3 = res;
    });
    this.translate.get('pop4').subscribe((res: string) => {
      pop4 = res;
    });
    this.translate.get('pop5').subscribe((res: string) => {
      pop5 = res;
    });

    var id = this.structure.type == "association" ? this.structure.associationId : this.structure.hcpCenterId;
    this.http.get('http://vascern.azurewebsites.net/api/FavaritesApi/ChekFavorites/' + this.uuid + "/" + id + "/" + structure.type + "?" + Math.random().toString(36)).map(res => res.json()).subscribe(data => { 
      if(data) {
        let alert = this.alertCtrl.create({
          title: pop3,
          subTitle: pop5,
          buttons: ['Ok']
        });
        alert.present();
        this.isFavourite = false;
      } else {
        let alert = this.alertCtrl.create({
          title: pop3,
          subTitle: pop4,
          buttons: ['Ok']
        });
        alert.present();
        this.isFavourite = true;
      }
    });
  }

  goToRelated(id) {
    this.navCtrl.push(RelatedPage, {
      id: id,
      type: this.structure.type
    });
  }

}
