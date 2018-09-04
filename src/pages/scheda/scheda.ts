import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, Platform, AlertController, } from 'ionic-angular';
import { CallNumber } from '@ionic-native/call-number';
import { EmailComposer } from '@ionic-native/email-composer';
import { LaunchNavigator } from '@ionic-native/launch-navigator';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map'
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { NativeStorage } from '@ionic-native/native-storage';
import { RelatedPage } from '../related/related';
import { UniqueDeviceID } from '@ionic-native/unique-device-id';

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

  constructor(private uniqueDeviceID: UniqueDeviceID, private alertCtrl: AlertController, public platform: Platform, public nativeStorage: NativeStorage, private iab: InAppBrowser, private launchNavigator: LaunchNavigator, private emailComposer: EmailComposer, public navCtrl: NavController, public navParams: NavParams, public http: Http, public viewCtrl: ViewController, private callNumber: CallNumber) {
    let localData = http.get('assets/structure.json').map(res => res.json().items);
    localData.subscribe(data => {
      this.information = data;
    })
    platform.ready().then((readySource) => { 
      if(platform.is('ios')) {
        this.operatingSystem = "ios";
      } else {
        this.operatingSystem = "android";
      }
    });
    this.structure = this.navParams.get('structure');
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
      this.http.get('http://vascernapi.azurewebsites.net/api/diseaseapi/GetDiseaseHcpByCenterId/' + this.structure.id).map(res => res.json()).subscribe(data => {
        this.diseaseHcp = data;
      });
    } else {
      this.http.get('http://vascernapi.azurewebsites.net/api/diseaseapi/GetDiseaseAssociationByCenterId/' + this.structure.id).map(res => res.json()).subscribe(data => {
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
      //cc: 'erika@mustermann.de',
      //bcc: ['john@doe.com', 'jane@doe.com'],
      subject: 'Info',
      body: 'Info',
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
    this.http.get('http://vascernapi.azurewebsites.net/api/Favourites/ChekOnlyFavorites/' + this.uuid + "/" + this.structure.id + "/" + this.structure.type + "?" + Math.random().toString(36)).map(res => res.json()).subscribe(data => {
      console.log(data)  
      if(data) {      
        this.isFavourite = true;
      } else {
        this.isFavourite = false;
      }
    });
  }

  addRemoveFavourite(structure) {
    this.http.get('http://vascernapi.azurewebsites.net/api/Favourites/ChekFavorites/' + this.uuid + "/" + structure.id + "/" + structure.type + "?" + Math.random().toString(36)).map(res => res.json()).subscribe(data => { 
      if(data) {
        let alert = this.alertCtrl.create({
          title: 'Information',
          subTitle: 'Removed from favorites',
          buttons: ['Ok']
        });
        alert.present();
        this.isFavourite = false;
      } else {
        let alert = this.alertCtrl.create({
          title: 'Information',
          subTitle: 'Added to favorites',
          buttons: ['Ok']
        });
        alert.present();
        this.isFavourite = true;
      }
    });
  }

  goToRelated() {
    this.navCtrl.push(RelatedPage, {
      id: this.structure.id,
      type: this.structure.type
    });
  }

}
