import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, LoadingController, Content } from 'ionic-angular';
import { Http } from '@angular/http';
import { SearchResultPage } from '../search-result/search-result';
import { NativeStorage } from '@ionic-native/native-storage';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';
import { Keyboard } from '@ionic-native/keyboard';

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
  seachStructures:any[] = [];
  structuresCopy:any[] = [];
  descending: boolean = false;
  order: number;
  column: string = 'name';
  loading: any; 
  az: boolean = true;
  last: boolean = false;
  @ViewChild(Content)
  content:Content;

  constructor(public keyboard: Keyboard, public nativeStorage: NativeStorage, public navCtrl: NavController, public navParams: NavParams, public http: Http, public loadingCtrl: LoadingController) {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    this.loading.present();
  }

  ngAfterViewInit() {
    this.content.ionScrollStart.subscribe((data)=>{
      this.keyboard.close();
    });
  }

  ionViewDidLoad() {
    this.loadStructure();
  }

  sort(){
    this.structures = this.structuresCopy;
    this.descending = !this.descending;
    this.order = this.descending ? 1 : 1;
    this.last = false;
    this.az = true;
  }

  lastSearch(){
    this.getLastSarch();
    this.last = true;
    this.az = false;
  }

  loadStructure() {
    this.http.get('http://vascernapi.azurewebsites.net/api/diseaseApi').map(res => res.json()).subscribe(data => {
      this.structures = data;
      this.structuresCopy = data;
      this.sort();
      this.loading.dismiss();
    }); 
  }

  getLastSarch() {
    this.nativeStorage.getItem('search')
    .then(
      data => {
        console.log(data)
        this.seachStructures = data;
        this.structures = data;
      },
      error => console.error(error)
    );
  }

  goTo(c) {
/*
    this.navCtrl.push(SearchResultPage, {
      name: c.name,
      orphaCode: c.orphacode,
      website: c.website,
      id: c.id
    });
*/
    this.seachStructures.push(c);
    this.nativeStorage.clear()
    this.nativeStorage.remove('search')
    this.nativeStorage.setItem('search', this.seachStructures)
      .then(
        () => {
          this.navCtrl.push(SearchResultPage, {
            name: c.name,
            orphaCode: c.orphacode,
            website: c.website,
            id: c.id
          });
          console.log('Stored item!')
        }, 
        error => console.error('Error storing item', error)
    );
  }
}
