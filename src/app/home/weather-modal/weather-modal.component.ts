import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';

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
  apiChoice: string = "rel_jjb";
  
  constructor(private modalCTRL: ModalController, private alertCTRL: AlertController) {
    this.items = this.getItems(); 
  }

  dismissModal(){
    this.modalCTRL.dismiss(null, "cancel");
  }

  async submit(){
    if(this.inputed_word.trim().length < 1 || this.apiChoice.length < 1) {
      const alert = await this.alertCTRL.create({
        header: 'Error',
        message: 'You must input a word',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }
    
    if(this.inputed_regex.length < 1)
      this.inputed_regex = "*"

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
    ]
  }



}
