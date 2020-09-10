import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ModalController, Platform } from 'ionic-angular';
import { Http } from '@angular/http';
import { SchedaPage } from '../scheda/scheda';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';
import { LanguageactiveProvider } from '../../providers/languageactive/languageactive';

/**
 * Generated class for the RelatedPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-related',
  templateUrl: 'related.html',
})
export class RelatedPage {

  structuresHcp:any[] = [];
  structuresAss:any[] = [];
  loading: any;
  id: any;
  type: any;
  os: string;
  theColor: any = "blue";

  constructor(public lng: LanguageactiveProvider, public plt: Platform, public modalCtrl: ModalController, public http: Http, public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController) {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    if (this.plt.is('ios')) {
      // This will only print when on iOS
      this.os = "ios";
    } else {
      this.os = "android";
    }
    this.loading.present();
    this.id = this.navParams.get('id');
    this.type = this.navParams.get('type');

    if(this.type != 'association') {
      this.theColor= "blue";
    } else {
      this.theColor= "orange";
    }
  }

  ionViewDidLoad() {
    if(this.type == "association") {
      this.http.get('http://vascern.azurewebsites.net/api/HcpCentersApi/GetRelatedHcp/' + this.id + '/' + this.lng.languageActive).map(res => res.json()).subscribe(data => {
        this.structuresHcp = data
        this.loading.dismiss();
      });
    } else {
      this.http.get('http://vascern.azurewebsites.net/api/HcpCentersApi/GetRelatedAssociation/' + this.id + '/' + this.lng.languageActive).map(res => res.json()).subscribe(data => {
        this.structuresAss = data
        this.loading.dismiss();
      });
    }
  }

  goTo(structure) {
    let profileModal = this.modalCtrl.create(SchedaPage, { structure: structure });
     profileModal.present();
  }

}
