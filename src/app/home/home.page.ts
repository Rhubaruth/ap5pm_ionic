import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { WeatherModalComponent } from './weather-modal/weather-modal.component';
import { PlacesService } from '../services/places/places.service';
//import { Preferences } from '@capacitor/preferences';

// npm install @capacitor/preferences in the app folder
import { Preferences } from '@capacitor/preferences';



@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  countriesDataArray: any[] = [];

  constructor(
    public modalCTRL: ModalController, 
    public http: HttpClient, 
    // new

    private placesService: PlacesService
   // private placesService: PlacesService
    ) {

    // Step 1 for countries fetch in HomePage constructor
    const getCountryData = async () => {
      const { value } = await Preferences.get({
        key: "homeFetchData"
      });

      if (value) {
        const fetchedItems = JSON.parse(value); // T F T F
        this.countriesDataArray = fetchedItems;
      }
    }

    getCountryData();

    }

  async openModal(){
    const modal = await this.modalCTRL.create({
      component: WeatherModalComponent
    });

    await modal.present();
    const {data: newData, role} = await modal.onWillDismiss();

    // Read data
    if (role === "location"){
      console.log(newData);

      this.fetchData(newData);

    }
  }


  sendData(data: any){
    this.placesService.data = data;
  }

  fetchData(countries: any){ 
    this.countriesDataArray = [];

    console.log(countries)
    for (var c of countries){
      const url = `https://api.datamuse.com/words?rel_jjb=${c.label}`;
    
      const subscribeFunction = (label: string) => (data: any) => {
        var formatedData = {
          query: label,
          result: data,
        }
        // console.log(formatedData);
        this.countriesDataArray.push(formatedData);
    
        // Step 3 save data
        const saveStoredItems = async () => {
          await Preferences.set({
            key: "homeFetchData",
            value: JSON.stringify(this.countriesDataArray)
          });
        };
    
        saveStoredItems();
        // console.warn(this.countriesDataArray);
      };
    
      this.http.get(url).subscribe(subscribeFunction(c.label));
    }
    console.log("Load data from API");
    
  }

}
