import { Injectable, Renderer2 } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  static state: boolean = false;
  static renderer: Renderer2;

  constructor() 
  { 
  }

  // set theme
  onThemeChange(event: any) {
    this.activeTheme(event.detail.checked)
  }

  activeTheme(darkMode: boolean) {
    ThemeService.state = darkMode;
    if(darkMode) 
      ThemeService.renderer.setAttribute(document.body, 'color-theme', 'dark')
    else
      ThemeService.renderer.setAttribute(document.body, 'color-theme', 'light')
  }

}
