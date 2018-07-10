import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { SchedaPage } from '../scheda/scheda';

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

  goTo() {
    let profileModal = this.modalCtrl.create(SchedaPage, { userId: 8675309 });
    profileModal.present();
  }
 
  ionViewDidLoad() {
    console.log('ionViewDidLoad MenuPage');
  }

}
