import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Slides, ModalController, LoadingController } from 'ionic-angular';
import { Http } from '@angular/http';
import { CallNumber } from '@ionic-native/call-number';
import { EmailComposer } from '@ionic-native/email-composer';
import { LaunchNavigator } from '@ionic-native/launch-navigator';
import { SchedaPage } from '../scheda/scheda';
import { NativeStorage } from '@ionic-native/native-storage';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';
import { UniqueDeviceID } from '@ionic-native/unique-device-id';
import { AlertController } from 'ionic-angular';

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
  loading: any;
  uuid: any;

  constructor(private alertCtrl: AlertController, private uniqueDeviceID: UniqueDeviceID, public nativeStorage: NativeStorage, public modalCtrl: ModalController,private launchNavigator: LaunchNavigator, private callNumber: CallNumber, private emailComposer: EmailComposer, public navCtrl: NavController, public navParams: NavParams, public http: Http, public loadingCtrl: LoadingController) {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    this.loading.present();
  }

  ionViewDidEnter() {
    this.structures = [];
    this.uniqueDeviceID.get().then((uuid: any) => {
      this.uuid = uuid;
      this.getFavorites();
    }).catch((error: any) => console.log(error));
  }

  getFavorites() {
    this.http.get('http://vascernapi.azurewebsites.net/api/Favourites/GetPersonalFavorites/' + this.uuid + "?" + Math.random().toString(36)).map(res => res.json()).subscribe(data => {
      if(data.length != 0) {
        data.forEach(element => {
          this.loadStructure(element.structureId, element.type);
        });
        this.slides.slideTo(0);
        this.loading.dismiss();
      } else {
        this.loading.dismiss();
      }
      
    });

  }

  loadStructure(id, type) {
    if(type == "hcp") {
      this.http.get('http://vascernapi.azurewebsites.net/api/HcpCenterApi/' + id + "?" + Math.random().toString(36)).map(res => res.json()).subscribe(data => {
        this.structures.push(data);
        if(this.structures.length == 1) {
          this.slides.slidesPerView = 1 ;
        } else {
          this.slides.slidesPerView = 1.2 ;
        }
      });
    } else {
      this.http.get('http://vascernapi.azurewebsites.net/api/AssociationApi/' + id + "?" + Math.random().toString(36)).map(res => res.json()).subscribe(data => {
        this.structures.push(data);
        if(this.structures.length == 1) {
          this.slides.slidesPerView = 1 ;
        } else {
          this.slides.slidesPerView = 1.2 ;
        }
      });
    }
    
  } 

  ngAfterViewInit() {
    this.slides.spaceBetween = 20;
    this.slides.slidesPerView = 1.2 ;
  }

  call(number) {
    this.callNumber.callNumber(number, false);
  } 

  email(em) {
    let email = {
      to: em,
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

  deleteFavourite(id) { 
    let alert = this.alertCtrl.create({
      title: 'Confirm Delete',
      message: 'Are you sure you want to remove this card from your favorites?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'YES',
          handler: () => {
            this.http.get('http://vascernapi.azurewebsites.net/api/Favourites/DeletePersonalFavorites/' + this.uuid + "/" + id + "?" + Math.random().toString(36)).map(res => res.json()).subscribe(data => {
              this.structures = [];
              this.getFavorites();
            });
          }
        }
      ]
    });
    alert.present();
  } 



}
