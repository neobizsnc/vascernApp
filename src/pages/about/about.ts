import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  constructor(private iab: InAppBrowser, public navCtrl: NavController) {

  }

  openPage(link) {
    const browser = this.iab.create(link);
    browser.show()
  }

}
