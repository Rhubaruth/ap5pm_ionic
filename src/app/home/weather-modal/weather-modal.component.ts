import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

// Capacitor step 1
import { Preferences } from '@capacitor/preferences';

@Component({
  selector: 'app-weather-modal',
  templateUrl: './weather-modal.component.html',
  styleUrls: ['./weather-modal.component.scss'],
})
export class WeatherModalComponent {
  items = this.getItems();
  inputed_word: string = "";
  inputed_regex: string = "";
  apiChoice: string = "";
  
  constructor(private modalCTRL: ModalController) {
    this.items = this.getItems(); 
  }


  dismissModal(){
    this.modalCTRL.dismiss(null, "cancel");
  }

  submit(){
    const selectedItems = this.items.filter((item) => item.checked);
    console.log(this.apiChoice)

    /* Capacitor step 3 */
    const saveStoredItems = async () => {
      await Preferences.set({
        key: "jsonData",
        value: JSON.stringify(selectedItems)
      });
    };

    // saveStoredItems();
    var inputed = {
      label: this.inputed_word,
      regex: this.inputed_regex,
      apiChoice: this.apiChoice,
      checked: false,
    }
    this.modalCTRL.dismiss([inputed], "location");
  }


  getItems(){
    return [
      { label: "Describing adjective", checked: true, value: "rel_jjb"},
      { label: "Related world", checked: false, value: "ml"},
      { label: "Following world", checked: false, value: "lc"},
      { label: "Regular Expresion", checked: false, value: "sp"},
    ]
  }



}
