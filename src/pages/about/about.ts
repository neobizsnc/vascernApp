import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { EmailComposer } from '@ionic-native/email-composer';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  constructor(private iab: InAppBrowser, public navCtrl: NavController, private emailComposer: EmailComposer) {

  }

  openPage(link) {
    const browser = this.iab.create(link);
    browser.show()
  }

  email(em) {
    let email = {
      to: em,
      subject: '',
      body: '',
      isHtml: true
    };
    this.emailComposer.open(email);
  }

}
