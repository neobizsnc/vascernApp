import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { AboutPage } from '../about/about';
import { CreditsPage } from '../credits/credits';
import { TutorialInactivePage } from '../tutorial-inactive/tutorial-inactive';
/**
 * Generated class for the MenuPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class MenuPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController) {
  }

  goToAbout() {
    this.navCtrl.push(AboutPage);
  }

  goToCredits() {
    this.navCtrl.push(CreditsPage);
  }

  goToUse() {
    this.navCtrl.push(TutorialInactivePage);
  }
 
  ionViewDidLoad() {
    console.log('ionViewDidLoad MenuPage');
  }

}
