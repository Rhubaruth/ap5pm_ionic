import { Component, Renderer2 } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { WeatherModalComponent } from './weather-modal/weather-modal.component';
import { PlacesService } from '../services/places/places.service';
//import { Preferences } from '@capacitor/preferences';

// npm install @capacitor/preferences in the app folder
import { Preferences } from '@capacitor/preferences';
import { ThemeService } from '../theme.service';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  // themes
  public isDark: boolean = ThemeService.state;
  

  countriesDataArray: any[] = [];

  constructor(
    public modalCTRL: ModalController, 
    public http: HttpClient, 

    private placesService: PlacesService,
    private renderer: Renderer2,
    public theme: ThemeService,
    ) {
      ThemeService.renderer = renderer
      this.isDark = ThemeService.state
      this.theme.activeTheme(this.isDark)

      // Step 1 for countries fetch in HomePage constructor
      const getCountryData = async () => {
        const { value } = await Preferences.get({
          key: "homeFetchData"
      });

      if (value) {
        const fetchedItems = JSON.parse(value); 
        this.countriesDataArray = fetchedItems;
      }
    }

    getCountryData();
  }

  ionViewWillEnter(){
    this.isDark = ThemeService.state
  }

  // set theme
  onThemeChange(event: any) {
    this.isDark = event.detail.checked
    this.theme.activeTheme(this.isDark)
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

  async deleteItem(selected: any){
    console.log(selected)
    var index =  this.countriesDataArray.findIndex(
      x => x.query==selected.query
        && x.apiChoice==selected.apiChoice
        && x.regex==selected.regex);
    console.log(index);

    this.countriesDataArray.splice(index, 1)

    const saveStoredItems = async () => {
      await Preferences.set({
        key: "homeFetchData",
        value: JSON.stringify(this.countriesDataArray)
      });
    };

    saveStoredItems();

  }

  sendData(data: any){
    this.placesService.data = data;
  }

  fetchData(input_data: any){ 
    console.log(input_data)
    for (var c of input_data){
      const url = `https://api.datamuse.com/words?${c.apiChoice}=${c.label}&md=s&sp=${c.regex}`;
      console.log(url)
    
      const subscribeFunction = (
          label: string, choice: string, regex: string
          ) => (data: any) => {
        var formatedData = {
          query: label,
          apiChoice: this.getShortDescription(choice),
          regex: regex,
          result: data,
        }
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
    
      this.http.get(url).subscribe(
        subscribeFunction(c.label, c.apiChoice, c.regex));
    }
    console.log("Load data from API");
    
  }


  getShortDescription(choice: string) {
    const apiChoices: Map<string, string> = new Map([
      ['rel_jjb', "Adjectives"],
      ['ml', "Related"],
      ['lc', "Following"],
      ['sp', "RegEx"],
    ]);
    return apiChoices.get(choice)
  }

}

