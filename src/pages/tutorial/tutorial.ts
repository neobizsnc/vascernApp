import { Component,ViewChild } from '@angular/core';
import { NavController, NavParams, Platform, Slides } from 'ionic-angular';
import { TabsPage } from '../../pages/tabs/tabs';

/**
 * Generated class for the TutorialPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-tutorial',
  templateUrl: 'tutorial.html',
})
export class TutorialPage {

  @ViewChild(Slides) slides: Slides;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public platform: Platform ) {

  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad TutorialPage');
  }

  goToHome(){
    this.navCtrl.setRoot(TabsPage);
  }
  goNext(){
    this.slides.slideNext(300)
  }

}
