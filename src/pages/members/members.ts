import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, LoadingController } from 'ionic-angular';
import { Http } from '@angular/http';
import { SchedaPage } from '../scheda/scheda';
import { LanguageactiveProvider } from '../../providers/languageactive/languageactive';

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

  constructor(
    public http: Http,
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public modalCtrl: ModalController,  
    public loadingCtrl: LoadingController,
    public lng: LanguageactiveProvider) {
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


console.log( this.lng.languageActive);

    this.http.get('http://vascern.azurewebsites.net/api/HcpCentersApi/GetCentersByCountryNew/english?' + Math.random().toString(36)).map(res => res.json()).subscribe(data => {

      this.structures = this.groupByArray(data, "country")

      this.structures.sort(function(a, b){
        console.log("LOG kEY a", a.key);
        console.log("LOG kEY b", b.key);
        if(a.key != null && b.key != null) {
          var nameA=a.key.toLowerCase(), nameB=b.key.toLowerCase();
          if (nameA < nameB) //sort string ascending
           return -1;
          if (nameA > nameB)
           return 1;
          return 0
        } else {
          return 0; //default return value (no sorting)
        }
       });

      this.loading.dismiss();
       
    });
  }

  goTo(structure) {
    let profileModal = this.modalCtrl.create(SchedaPage, { structure: structure });
     profileModal.present();
  }

}
