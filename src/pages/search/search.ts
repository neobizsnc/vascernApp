import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { Http } from '@angular/http';
import { SearchResultPage } from '../search-result/search-result';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';

/**
 * Generated class for the SearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {

  structures: any;
  descending: boolean = false;
  order: number;
  column: string = 'name';
  loading: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, public loadingCtrl: LoadingController) {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    this.loading.present();
  }

  ionViewDidLoad() {
    this.loadStructure();
  }

  sort(){
    this.descending = !this.descending;
    this.order = this.descending ? 1 : -1;
  }

  loadStructure() {
    this.http.get('http://vascernapi.azurewebsites.net/api/diseaseApi').map(res => res.json()).subscribe(data => {
      this.structures = data;
      this.loading.dismiss();
    });
  }

  goTo(name, orphaCode, website, id) {
    this.navCtrl.push(SearchResultPage, {
      name: name,
      orphaCode: orphaCode,
      website: website,
      id: id
    });
  }

}
