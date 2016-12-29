import { Loader } from './../../providers/loader';
import { PlayerPage} from './../player/player';
import { NavController } from 'ionic-angular';
import { YoutubeService } from './../../providers/youtube-service';
import { Component, Output, EventEmitter  } from '@angular/core';
import 'rxjs/add/operator/map';
import {YTChannelBean} from './../../model/YTBean';


@Component({
  selector: 'page-channels',
  templateUrl: 'channels.html'
})
export class ChannelsPage {
   public channel : YTChannelBean = null;
   public searchQuery: string = '';
   private readonly YT_INIT_CHANNEL= 'UCb40SExvsnL0Id3jrDBSI9w';
   //output, sin los campos o eventos que puede enviar al componente padrepara ejecutar eventos desde fuera del componente https://docs.ionic.io/api/client/eventemitter/
   @Output() playFromSlide : EventEmitter<any> = new EventEmitter<any>();

   constructor(public navCtrl: NavController, private youtubeData : YoutubeService, public loader: Loader ) { 
   /*
   cordova-plugin reboot
     //Prueba auditoria, reboot
     setTimeout(function() {
    console.log("REBOOT!!!!");
     //window.cordova.plugins.Reboot.reboot();
  }, 5000);
 */

     this.channel = new YTChannelBean(this.YT_INIT_CHANNEL,null,null, null);
     loader.loading.present();
     this.youtubeData.fetchPlayListByChannel(this.channel).subscribe(data => {
          //el channel ya viene con el listado de suscripciones relleno
          loader.loading.dismiss();
      });
    }

    
   /**
    * Invoca al listado para obtener los siguientes registros a través del channel.nextToken
    * 
    * @param {YTChannelBean} chnl
    * 
    * @memberOf ChannelsPage
   */
   doInfinite(infiniteScroll) {
    if (this.channel.subscriptionsList.length<this.channel.totalClips){
     this.youtubeData.fetchPlayListByChannel(this.channel).subscribe(data => {
       //una vez obtenido nuevo listado, informamos al componente infiniteScroll
        infiniteScroll.complete();              
      });
    }else{
      infiniteScroll.complete();  
    }
  }

 /**
  * Nsvega a la página del channel, pasándole el channel seleccionado
  * 
  * @param {YTChannelBean} chnl
  * 
  * @memberOf ChannelsPage
  */
  selectChannel ( chnl :YTChannelBean): void {
    this.navCtrl.push(PlayerPage,{'channel':chnl});
  }
  
}
