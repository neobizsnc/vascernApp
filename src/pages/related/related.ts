import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ModalController, Platform } from 'ionic-angular';
import { Http } from '@angular/http';
import { SchedaPage } from '../scheda/scheda';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';

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

  constructor(public plt: Platform, public modalCtrl: ModalController, public http: Http, public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController) {
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
  }

  ionViewDidLoad() {
    if(this.type == "association") {
      this.http.get('http://vascernapi.azurewebsites.net/api/HcpCenterApi/GetRelatedHcp/' + this.id).map(res => res.json()).subscribe(data => {
        this.structuresHcp = data
        this.loading.dismiss();
      });
    } else {
      this.http.get('http://vascernapi.azurewebsites.net/api/HcpCenterApi/GetRelatedAssociation/' + this.id).map(res => res.json()).subscribe(data => {
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
