import { Component, OnInit } from '@angular/core';
import { PlacesService } from '../../services/places/places.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {
  allData: any; 
  sortedResult: Map<string, any> = new Map();

  constructor(
    private placeService: PlacesService 
  ) { }

  ngOnInit() {
    this.allData = this.placeService.data; 

    let myArray = this.allData.result.slice(0, 20);
    myArray.sort( (a: any, b: any) => a.numSyllables - b.numSyllables);
    
    myArray.forEach((element: any) => {
      if(this.sortedResult.has(element.numSyllables)) {
        let list: Array<string> = this.sortedResult.get(element.numSyllables)
        list.push(element.word)
        this.sortedResult.set(element.numSyllables, list)
      } else {
        this.sortedResult.set(element.numSyllables, new Array<string>(element.word))
      }
    });

    this.sortedResult.forEach((value: Array<string>, key: string) => {
      this.sortedResult.set(key, value.sort()) 
    })
  }

  // Convert the Map to an array of key-value pairs
  getSharedPositionArray() {
    return Array.from(this.sortedResult.entries());
  }
}
