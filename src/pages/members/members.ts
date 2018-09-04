import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, LoadingController } from 'ionic-angular';
import { Http } from '@angular/http';
import { SchedaPage } from '../scheda/scheda';

/**
 * Generated class for the MembersPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

 

@Component({
  selector: 'page-members',
  templateUrl: 'members.html',
})
export class MembersPage {

  structures:any[] = [];;
  loading: any; 

  constructor(public http: Http,public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController,  public loadingCtrl: LoadingController) {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    this.loading.present();
  }


  groupByArray(xs, key) {
    return xs.reduce(function (rv, x) {
        let v = key instanceof Function ? key(x) : x[key];
        let el = rv.find((r) => r && r.key === v);
        if (el) {
            el.values.push(x);
        }
        else {
            rv.push({
                key: v,
                values: [x]
            });
        }
        return rv;
    }, []);
}

  


  ionViewDidLoad() {
    this.http.get('http://vascernapi.azurewebsites.net/api/HcpCenterApi/GetCentersByCountryNew' + "?" + Math.random().toString(36)).map(res => res.json()).subscribe(data => {

      this.structures = this.groupByArray(data, "country")

      this.structures.sort(function(a, b){
        var nameA=a.key.toLowerCase(), nameB=b.key.toLowerCase();
        if (nameA < nameB) //sort string ascending
         return -1;
        if (nameA > nameB)
         return 1;
        return 0; //default return value (no sorting)
       });

      this.loading.dismiss();
       
    });
  }

  goTo(structure) {
    let profileModal = this.modalCtrl.create(SchedaPage, { structure: structure });
     profileModal.present();
  }

}
