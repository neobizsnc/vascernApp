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
  favourites:any[] = [];

  constructor(public nativeStorage: NativeStorage, public modalCtrl: ModalController,private launchNavigator: LaunchNavigator, private callNumber: CallNumber, private emailComposer: EmailComposer, public navCtrl: NavController, public navParams: NavParams, public http: Http) {
    console.log("con structor")
  }

  loadStructure(id) {
    this.http.get('http://vascernapi.azurewebsites.net/api/HcpCenterApi/' + id).map(res => res.json()).subscribe(data => {
      this.structures.push(data);
      if(this.structures.length == 1) {
        this.slides.slidesPerView = 1 ;
      } else {
        this.slides.slidesPerView = 1.2 ;
      }
    });
  } 

  ngAfterViewInit() {
    this.slides.spaceBetween = 20;
    this.slides.slidesPerView = 1.2 ;
  }

  ionViewDidLoad() {
    this.getStorage();
    
    console.log('ionViewDidLoad FavouritePage');
  }


  getStorage() {
    this.nativeStorage.getItem('favourite')
    .then(
      data => {
        this.favourites = data;
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

  goTo(structure) {
    let profileModal = this.modalCtrl.create(SchedaPage, { structure: structure });
     profileModal.present();
  }
 
  setStorage() {
    this.nativeStorage.clear()
    this.nativeStorage.remove('favourite')
    this.nativeStorage.setItem('favourite', this.favourites)
      .then(
        () => {
          console.log('Stored item!')
        }, 
        error => console.error('Error storing item', error)
      );
  }

  deleteFavourite(id) { 
    if(this.favourites.indexOf(id) !== -1) {
      this.favourites.splice(this.favourites.indexOf(id), 1);
      this.structures.splice(this.favourites.indexOf(id), 1);
      this.setStorage();

      if(this.structures.length == 1) {
        this.slides.slidesPerView = 1 ;
      }
    }
  } 

}
