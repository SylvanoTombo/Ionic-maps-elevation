import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { Subscription } from 'rxjs/Subscription';
import { Geolocation } from '@ionic-native/geolocation';
import { filter } from 'rxjs/operators';

/**
 * Generated class for the TrackerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-tracker',
  templateUrl: 'tracker.html',
})
export class TrackerPage {

  @ViewChild('map') mapElement: ElementRef;
  map: any;
  currentMapTrack = null;

  isTracking = false;
  trackedRoute = [];
  previousTracks = [];

  positionSubscription: Subscription;

  constructor(public navCtrl: NavController, private plt: Platform, private geolocation: Geolocation) {
  }

  ionViewDidLoad() {
    this.plt.ready().then(() => {
      let mapOptions = {
        zoom: 13,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false
      }

      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

      this.geolocation.getCurrentPosition().then((pos) => {
        let latLng = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
        this.map.setCenter(latLng);
        this.map.setZoom(16);
      }).catch((error) => {
        console.log('Error');
      });
    });
  }

  startTracking() {
    this.isTracking = true;
    this.trackedRoute = [];

    this.positionSubscription = this.geolocation.watchPosition()
        .pipe(
          filter((p) => p.coords !== undefined)
        )
        .subscribe(data => {
          setTimeout(() => {
            this.trackedRoute.push({ lat: data.coords.latitude, lng: data.coords.longitude});
            console.log(this.trackedRoute);
            this.redrawPath(this.trackedRoute);
          });
        });
  }

  redrawPath(path) {
    if (this.currentMapTrack) {
      this.currentMapTrack.setMap(null);
    }
 
    if (path.length > 1) {
      this.currentMapTrack = new google.maps.Polyline({
        path: path,
        geodesic: true,
        strokeColor: '#ff00ff',
        strokeOpacity: 1.0,
        strokeWeight: 3
      });
      this.currentMapTrack.setMap(this.map);
    }
  }

  stopTracking() {
    this.isTracking = false;
    this.positionSubscription.unsubscribe();
    this.currentMapTrack.setMap(null);
  }
}
