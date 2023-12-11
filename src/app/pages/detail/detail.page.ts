import { Component, OnInit } from '@angular/core';
import { PlacesService } from '../../services/places/places.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {
  allData: any; 
  imageURL: string = "empty"; 
  region = "";
  population = "";
  startOfWeek = "";
  myDomain = "";
  myArray=[];


  constructor(
    private placeService: PlacesService 
  ) { }

  ngOnInit() {
    this.allData = this.placeService.data; 

    this.myArray = this.allData.result.slice(0, 10);
    // console.log(this.myArray)


    //this.myIframe = `<iframe src="${this.mapURL}" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`;
  }

}
