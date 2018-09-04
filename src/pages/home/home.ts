import { Component, ViewChild, NgZone, ElementRef } from '@angular/core';
import { NavController, Slides, Keyboard, Platform, NavParams, ModalController } from 'ionic-angular';
import { SchedaPage } from '../scheda/scheda';
import { CallNumber } from '@ionic-native/call-number';
import { LaunchNavigator } from '@ionic-native/launch-navigator';import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';
import { GoogleMaps, GoogleMap, LatLng, MyLocation } from '@ionic-native/google-maps';

declare var LatLon: any;
declare var google: any;

@Component({
  selector: 'page-home', 
  templateUrl: 'home.html',
  providers: [GoogleMaps] 
})

export class HomePage {

  map: GoogleMap;
  newMap: any; 
  structuresAssCenter:any[] = [];
  autocomplete: any;
  autocompleteItems: any;
  lat: any;
  lng: any;
  height: any; 
  cordinateFromSearch: LatLng;
  //google: any;
  markers: any[] = [];
  operatingSystem: any;

  @ViewChild('mapcanvas') mapElement: ElementRef;
  @ViewChild(Slides) slides: Slides;
  @ViewChild('header') header: ElementRef;

  constructor(private callNumber: CallNumber, 
              private launchNavigator: LaunchNavigator, 
              public modalCtrl: ModalController, 
              public navParams: NavParams, 
              public platform: Platform, 
              public navCtrl: NavController, 
              public http: Http, 
              public zone: NgZone, public keyboard: Keyboard) {
    this.autocomplete = {
      input: ''
    };
    this.autocompleteItems = [];
    platform.ready().then((readySource) => { 
      this.height = platform.height();
      if(this.platform.is('ios')) {
        this.operatingSystem = "ios";
      } else {
        this.operatingSystem = "android";
      }
    });

    keyboard.hideFormAccessoryBar(true);
  }

  ngAfterViewInit() {
    this.slides.spaceBetween = 10;
    this.slides.slidesPerView = 1
    if(this.platform.is('ios')) {
      //Iphone X
      this.operatingSystem = "ios";
      if(this.height > 800) {
        this.height = this.height - this.header.nativeElement.offsetHeight - 85;
      } else {
        this.height = this.height - this.header.nativeElement.offsetHeight - 50;
      }
    } else {
      this.operatingSystem = "android";
      this.height = this.height - this.header.nativeElement.offsetHeight - 50;
    }
  }

  setStyles() {
    let styles = {
        'height':  this.height + 'px'
    };
    return styles;
  }

  centerLocation() {
    this.map.getMyLocation().then((location: MyLocation) => {
      this.newMap.setCenter(new google.maps.LatLng(location.latLng.lat, location.latLng.lng));
      this.sortResults(location.latLng);
      this.rePrintMarker();
      this.slides.update();
      this.slides.slideTo(0, 500);
    })
  }

  updateSearchResults(){
    if (this.autocomplete.input == '') {
      this.autocompleteItems = [];
      return;
    }
    //AIzaSyDZ15vkJWNNl3tpZWRAPvoA3tBkpTqUt0k
    this.http.get('http://vascernapi.azurewebsites.net/Home/GetEventVenuesList?SearchText=' + this.autocomplete.input + '&ApiKey=AIzaSyBZW73ZAn-6PqKKAVuDOzYzMOB_m2dDLIo').map(res => res.json()).subscribe(data => {
      this.autocompleteItems = [];
      this.autocompleteItems.push(data[0]); 
    });
  }

  //AIzaSyDZ15vkJWNNl3tpZWRAPvoA3tBkpTqUt0k
  selectSearchResult(item){
    this.autocompleteItems = [];   
    this.http.get('http://vascernapi.azurewebsites.net/Home/GetGeocode?Address=' + item.description + '&ApiKey=AIzaSyBZW73ZAn-6PqKKAVuDOzYzMOB_m2dDLIo').map(res => res.json()).subscribe(data => {
      if(data.status === 'OK' && data.results[0]){
        this.lat = data.results[0].geometry.location.lat;
        this.lng = data.results[0].geometry.location.lng;
        this.keyboard.onClose(() => {
          let location = new google.maps.LatLng(this.lat, this.lng)
          this.newMap.setCenter(location);
          this.sortResults({lat: parseFloat(location.lat()), lng: parseFloat(location.lng())});
          this.rePrintMarker();
          this.slides.update();
          this.slides.slideTo(0, 500);
          this.autocomplete.input = '';
        });
      }
    });
  } 
 
  ionViewDidLoad() {
    this.loadStructure(this.navParams.get('id'));
  }

  loadStructure(id) {
    this.http.get('http://vascernapi.azurewebsites.net/api/HcpCenterApi/GetCentersByDiseaseId/' + id + "?" + Math.random().toString(36)).map(res => res.json()).subscribe(data => {
      let latLng = new google.maps.LatLng(-34.9290, 138.6010);
 
      let mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      } 
      this.newMap = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
      data.diseaseCenter.forEach((val) => {
        this.structuresAssCenter.push(val.hcpCenter)
      });
      data.diseaseAssociation.forEach((val) => {
        this.structuresAssCenter.push(val.association)
      }); 
      console.log(this.structuresAssCenter)
      this.map = GoogleMaps.create('test');
      this.map.getMyLocation().then((location: MyLocation) => {
        this.newMap.setCenter(new google.maps.LatLng(location.latLng.lat, location.latLng.lng));
        this.sortResults(location.latLng);
        this.slides.update();
        this.setMarker();
      })
    });
  }

  setMarker() {
    this.structuresAssCenter.forEach((val, index) => {
      let ico:any;
      if(val.type == "association") {
        ico = 'assets/imgs/GEO_ASSOCIATION_OFF.svg'
      } else {
        ico = 'assets/imgs/GEO_HCP_OFF.svg'
      }
      let marker = new google.maps.Marker({
        position: {lat: parseFloat(val.lat), lng: parseFloat(val.lng)},
        map: this.newMap,
        icon: {  url : ico },
        title: 'Hello World!'
      });
      marker.addListener('click', () => {
        this.newMap.setZoom(8);
        this.newMap.setCenter(marker.getPosition());
        this.slides.slideTo(index, 500);
      }); 
      this.markers.push(marker);
    });
  }

  rePrintMarker() {
    for (var i = 0; i < this.markers.length; i++) {
      this.markers[i].setMap(null);
    }
    this.markers = [];
    this.setMarker();
  }

  sortResults(position) {
    var latlon = new LatLon(position.lat, position.lng);
    var locationArray = Array.prototype.slice.call(this.structuresAssCenter, 0); 
    locationArray.forEach(function(el){
      var distA = latlon.distanceTo(new LatLon(Number(el.lat),Number(el.lng)));
      el.distance = distA;
    });
    this.sortByKey(locationArray, "distance")
    this.structuresAssCenter = locationArray
  };

  sortByKey(array, key) {
    return array.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
  }
 
  slideChanged() {
    let currentIndex = this.slides.getActiveIndex();
    let location = new google.maps.LatLng(this.structuresAssCenter[currentIndex].lat, this.structuresAssCenter[currentIndex].lng)
    
    this.structuresAssCenter.forEach((val, index) => {
      if(val.type == 'association') {
        this.markers[index].icon.url = 'assets/imgs/GEO_ASSOCIATION_OFF.svg';
      } else {
        this.markers[index].icon.url = 'assets/imgs/GEO_HCP_OFF.svg';
      }
    })

    console.log(this.markers[currentIndex])
    
    if(this.structuresAssCenter[currentIndex].type == 'association') {
      this.markers[currentIndex].icon.url = 'assets/imgs/GEO_ASSOCIATION_ON.svg';
      this.markers[currentIndex].icon.size.height = 44;
      this.markers[currentIndex].icon.size.width = 35;
    } else {
      this.markers[currentIndex].icon.url = 'assets/imgs/GEO_HCP_ON.svg';
      this.markers[currentIndex].icon.size.height = 44;
      this.markers[currentIndex].icon.size.width = 35;
    }

    this.newMap.setCenter(location);
  }
 
  goTo(structure) {
    let profileModal = this.modalCtrl.create(SchedaPage, { structure: structure });
     profileModal.present();
  }

  call(number) {
    this.callNumber.callNumber(number, false);
  }

  maps(address, zip, city, country) {
    this.launchNavigator.navigate(address + " " + zip + " " + city + " " + country)
      .then(
        success => console.log('Launched navigator'),
        error => console.log('Error launching navigator', error)
      );
  }

}