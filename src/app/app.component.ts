import { ChannelsPage } from './../pages/channels/channels';
import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { Events } from 'ionic-angular';


@Component({
  template: `<ion-nav [root]="rootPage"></ion-nav>`
})
export class MyApp {
  rootPage = ChannelsPage;

  constructor(platform: Platform, public events: Events) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();  
      //añado llamada para subscribirse a los eventos que lance
      this.bindingEvents(platform);   
    });
  }

  private bindingEvents(platform: Platform){
      this.events.subscribe('app:close', (data) => {
              console.log('appComponent', data[0]);
            //solo funciona en la app, no browser
            platform.exitApp();
               /*solo root en device
               instalar cordova-plugin reboot
                  //Prueba auditoria, reboot
                  setTimeout(function() {
                  console.log("REBOOT!!!!");
                  //window.cordova.plugins.Reboot.reboot();
                }, 5000);
 */
            
          });
        }
}
