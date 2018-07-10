import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Slides, ModalController } from 'ionic-angular';
import { Http } from '@angular/http';
import { CallNumber } from '@ionic-native/call-number';
import { EmailComposer } from '@ionic-native/email-composer';
import { LaunchNavigator } from '@ionic-native/launch-navigator';
import { SchedaPage } from '../scheda/scheda';
import { NativeStorage } from '@ionic-native/native-storage';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';

/**
 * Generated class for the FavouritePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-favourite',
  templateUrl: 'favourite.html',
})
export class FavouritePage {

  @ViewChild(Slides) slides: Slides;
  structures:any[] = [];

  constructor(public nativeStorage: NativeStorage, public modalCtrl: ModalController,private launchNavigator: LaunchNavigator, private callNumber: CallNumber, private emailComposer: EmailComposer, public navCtrl: NavController, public navParams: NavParams, public http: Http) {
    console.log("con structor")
  }

  loadStructure(id) {
    this.http.get('http://vascernapi.azurewebsites.net/api/HcpCenterApi/' + id).map(res => res.json()).subscribe(data => {
      this.structures.push(data);
    });
  }

  ngAfterViewInit() {
    this.slides.spaceBetween = 30;
    this.slides.slidesPerView = 1
  }

  ionViewDidLoad() {
    this.getStorage();
    console.log('ionViewDidLoad FavouritePage');
  }


  getStorage() {
    this.nativeStorage.getItem('favourite')
    .then(
      data => {
        data.forEach(element => {
          this.loadStructure(element);
        });
      },
      error => {
        console.error("Nessun dato salvato nello storage")
      }
    );
  }

  call(number) {
    this.callNumber.callNumber('02073627291', false);
  }

  email() {
    let email = {
      to: 'max@mustermann.de',
      cc: 'erika@mustermann.de',
      bcc: ['john@doe.com', 'jane@doe.com'],
      subject: 'Cordova Icons',
      body: 'How are you? Nice greetings from Leipzig',
      isHtml: true
    };
    this.emailComposer.open(email);
  }

  maps() {
    this.launchNavigator.navigate('Toronto, ON')
      .then(
        success => console.log('Launched navigator'),
        error => console.log('Error launching navigator', error)
      );
  }

  goTo() {
    let profileModal = this.modalCtrl.create(SchedaPage, { centerId: 8675309 });
     profileModal.present();
  }


}
