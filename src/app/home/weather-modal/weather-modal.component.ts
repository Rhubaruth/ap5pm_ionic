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
  apiChoice: string = "";
  
  constructor(private modalCTRL: ModalController) {
    this.items = this.getItems(); 

// Capacitor step 2
    const getStoredItems = async () => {
      const { value } = await Preferences.get({
        key: "jsonData"
      });

      if (value){
      const selectedItems = JSON.parse(value); // T F T F
      // items = [F F F F]
      this.items.forEach(item => {
        item.checked = selectedItems.some((selectedItem: { label: string; }) => selectedItem.label ===  item.label);
      });
    }

    };

    // getStoredItems();

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
