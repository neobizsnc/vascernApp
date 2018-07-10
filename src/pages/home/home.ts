import { Component, ViewChild, NgZone, ElementRef } from '@angular/core';
import { NavController, Slides, Keyboard, Platform, NavParams, ModalController } from 'ionic-angular';
import { SchedaPage } from '../scheda/scheda';
import { CallNumber } from '@ionic-native/call-number';
import { LaunchNavigator } from '@ionic-native/launch-navigator';import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  CameraPosition,
  LatLng,
  Marker,
  MyLocation,
} from '@ionic-native/google-maps';

declare var google : any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [GoogleMaps]
})

export class HomePage {

  map: GoogleMap;
  mapReady: boolean = false;
  structures:any[];
  autocomplete: any;
  GoogleAutocomplete: any;
  geocoder: any
  autocompleteItems: any;
  lat: any;
  lng: any;
  height: any;
  cordinateFromSearch: LatLng;
  
  @ViewChild(Slides) slides: Slides;
  @ViewChild('header') header: ElementRef;

  constructor(private callNumber: CallNumber, private launchNavigator: LaunchNavigator, public modalCtrl: ModalController, public navParams: NavParams, public platform: Platform, public navCtrl: NavController, private googleMaps: GoogleMaps,  public http: Http, public zone: NgZone, public keyboard: Keyboard) {
    this.geocoder = new google.maps.Geocoder;
    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    this.autocomplete = {
      input: ''
    };
    this.autocompleteItems = [];
    platform.ready().then((readySource) => {
      this.height = platform.height();
    });
    keyboard.hideFormAccessoryBar(true);
  }

  ngAfterViewInit() {
    this.slides.spaceBetween = 10;
    this.slides.slidesPerView = 1

    if(this.platform.is('ios')) {
      //Iphone X
      if(this.height > 800) {
        this.height = this.height - this.header.nativeElement.offsetHeight - 85;
      } else {
        this.height = this.height - this.header.nativeElement.offsetHeight - 50;
      }
    } else {
      this.height = this.height - this.header.nativeElement.offsetHeight - 50;
    }
  }

  setStyles() {
    let styles = {
        'height':  this.height + 'px'
    };
    return styles;
  }

  updateSearchResults(){
    if (this.autocomplete.input == '') {
      this.autocompleteItems = [];
      return;
    }
    this.GoogleAutocomplete.getPlacePredictions({ input: this.autocomplete.input },
      (predictions, status) => {
        this.autocompleteItems = [];
        if(predictions){ 
          this.zone.run(() => {
            predictions.forEach((prediction) => {
              this.autocompleteItems.push(prediction);
            });
          });
        }
    });
  }

  selectSearchResult(item){
    this.autocompleteItems = [];
    this.geocoder.geocode({'placeId': item.place_id}, (results, status) => {
      if(status === 'OK' && results[0]){
        this.lat = results[0].geometry.location.lat();
        this.lng = results[0].geometry.location.lng();
        this.keyboard.onClose(() => {
          let location: LatLng = new LatLng(this.lat, this.lng);
          let cameraOption: CameraPosition<any> = {
            target: location,
            zoom: 10,
            tilt: 10
          };
          this.map.moveCamera(cameraOption);
        });
      }
    })
  } 

  ionViewDidLoad() {
    this.loadStructure(this.navParams.get('id'));
  }

  loadStructure(id) {
    this.http.get('http://vascernapi.azurewebsites.net/api/HcpCenterApi/GetCentersByDiseaseId/' + id).map(res => res.json()).subscribe(data => {
      this.map = this.googleMaps.create('map_canvas');
      this.map.one(GoogleMapsEvent.MAP_READY).then(() => {
        this.mapReady = true;
        this.structures = data;
        console.log(data);
        this.slides.update();
        data.forEach((val, index) => {
          let marker: Marker = this.map.addMarkerSync({
            title: val.hcpCenter.name,
            snippet: val.hcpCenter.name,
            position: { lat: val.hcpCenter.lat, lng: val.hcpCenter.lng }
          });
          marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
            this.slides.slideTo(index, 500);
          })
        });
        this.map.getMyLocation().then((location: MyLocation) => {
          let cameraOption: CameraPosition<any> = {
            target: location.latLng,
            zoom: 15,
            tilt: 10
          };
          this.map.moveCamera(cameraOption);
        })
      });
    });
  }

  slideChanged() {
    let currentIndex = this.slides.getActiveIndex();
    let location: LatLng = new LatLng(this.structures[currentIndex].lat, this.structures[currentIndex].lng);
    let cameraOption: CameraPosition<any> = {
      target: location,
      zoom: 15,
      tilt: 10
    };
    this.map.moveCamera(cameraOption);
  }

  goTo(structure) {
    console.log(structure)
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