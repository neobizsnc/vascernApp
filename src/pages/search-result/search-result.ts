import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';
import { InAppBrowser } from '@ionic-native/in-app-browser';

/**
 * Generated class for the SearchResultPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-search-result',
  templateUrl: 'search-result.html',
})
export class SearchResultPage {

  name: any;
  orphaCode: any;
  website: any;
  id: any;

  constructor(private iab: InAppBrowser, public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.name = this.navParams.get('name');
    this.orphaCode = this.navParams.get('orphaCode');
    this.website = this.navParams.get('website');
    this.id = this.navParams.get('id');
    console.log('ionViewDidLoad SearchResultPage');
  }

  openBrowser() {
    const browser = this.iab.create(this.website);
    browser.show()
  } 

  goTo() {
    this.navCtrl.push(HomePage, {
      id: this.navParams.get('id'),
    });
  }

}
