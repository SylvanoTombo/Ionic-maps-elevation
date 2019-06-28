import { Component, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Chart } from 'chart.js';

declare var google;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  @ViewChild('lineCanvas') lineCanvas;
  lineChart: any;
  path: Array<{ lat: number, lng: number }>;
  elevationsData = [];

  constructor(public navCtrl: NavController) {
    this.path = [
      { lat: 36.579, lng: -118.292 },  // Mt. Whitney
      { lat: 36.606, lng: -118.0638 },  // Lone Pine
      { lat: 36.433, lng: -117.951 },  // Owens Lake
      { lat: 36.588, lng: -116.943 },  // Beatty Junction
      { lat: 36.34, lng: -117.468 },  // Panama Mint Springs
      { lat: 36.24, lng: -116.832 }
    ];  // Badwater, Death Valley
  }

  ionViewDidLoad() {
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
      'path': this.path,
      'samples': 50
    }, this.plotElevation.bind(this));

  }

  plotElevation(elevations, status) {
    if (status != 'OK') {
      console.log('Error');
      return;
    }

    elevations.map(elevation => {
      this.elevationsData.push(parseInt(elevation.elevation));
    });
    console.log(elevations);

    this.createChart(this.elevationsData);
  }

  showPath(event) {
    let activePoints = this.lineChart.getElementAtEvent(event)[0];
    if (activePoints) {
      console.log(this.elevationsData[activePoints._index]);
    }
  }

}
