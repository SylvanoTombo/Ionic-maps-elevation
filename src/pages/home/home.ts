import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Chart } from 'chart.js';
import { TrackerPage } from '../tracker/tracker';

declare var google;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  @ViewChild('map') mapElement: ElementRef;
  @ViewChild('lineCanvas') lineCanvas: ElementRef;
  map: any;
  lineChart: any;
  path: Array<{ lat: number, lng: number }>;
  elevationsData = [];
  newPath: Array<{ lat: number, lng: number }>;
  marker: google.maps.Marker;
  elevations: any;

  constructor(public navCtrl: NavController) {
   /*  this.path = [
      { lat: 36.579, lng: -118.292 },  // Mt. Whitney
      { lat: 36.606, lng: -118.0638 },  // Lone Pine
      { lat: 36.433, lng: -117.951 },  // Owens Lake
      { lat: 36.588, lng: -116.943 },  // Beatty Junction
      { lat: 36.34, lng: -117.468 },  // Panama Mint Springs
      { lat: 36.24, lng: -116.832 }
    ];  */ // Badwater, Death Valley

    this.newPath = [
      { lat: -18.88592, lng: 47.53972},
      { lat: -18.885567, lng: 47.539909},
      { lat: -18.883654, lng: 47.540888}
    ];

    this.marker = new google.maps.Marker();
  }

  ionViewDidLoad() {
    this.createMap();
    this.googleMaps();
  }

  createChart(elevationsData) {
    console.log(elevationsData);

    this.lineChart = new Chart(this.lineCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: elevationsData,
        datasets: [
          {
            fill: true,
            backgroundColor: "rgba(75,192,192,0.4)",
            borderColor: "rgba(75,192,192,1)",
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: "rgba(75,192,192,1)",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "rgba(75,192,192,1)",
            pointHoverBorderColor: "rgba(220,220,220,1)",
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: elevationsData,
            spanGaps: false,
          }
        ]
      },
      options: {
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            display: false //this will remove all the x-axis grid lines
          }]
        }
      }

    });
  }

  googleMaps() {
    let elevator = new google.maps.ElevationService;

    elevator.getElevationAlongPath({
      'path': this.newPath,
      'samples': 40
    }, this.plotElevation.bind(this));

  }

  plotElevation(elevations, status) {
    if (status != 'OK') {
      console.log('Error');
      return;
    }

    this.elevations = elevations;

    elevations.map(elevation => {
      this.elevationsData.push(elevation.elevation);
    });
    console.log(elevations);

    this.createChart(this.elevationsData);
  }

  showPath(event) {
    let activePoints = this.lineChart.getElementAtEvent(event)[0];
    if (activePoints) {
      let point: any = this.elevations[activePoints._index].location;
      console.log(point)
      this.marker.setPosition(point);
      this.marker.setMap(this.map);
    }
  }

  createMap() {
    this.map = new google.maps.Map(this.mapElement.nativeElement, {
      zoom: 15,
      center: this.newPath[0],
      mapTypeId: 'terrain'
    });
  }

  goToTracker() {
    this.navCtrl.push(TrackerPage);
  }

}
