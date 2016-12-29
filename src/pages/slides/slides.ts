import { YoutubeService } from './../../providers/youtube-service';
import { Component, Output, EventEmitter, Input  } from '@angular/core';
import { Events } from 'ionic-angular';
import 'rxjs/add/operator/map';
import {YTChannelBean, YTClipBean} from './../../model/YTBean';


@Component({
  selector: 'page-slides',
  templateUrl: 'slides.html'
})
export class SlidesPage {
  @Input() currentChannel:YTChannelBean ; 
   //output, sin los campos o eventos que puede enviar al componente padrepara ejecutar eventos desde fuera del componente https://docs.ionic.io/api/client/eventemitter/
  @Output() playFromSlide : EventEmitter<string> = new EventEmitter<string>();

  private _currentVideo : string;

   constructor(private youtubeData : YoutubeService, public events: Events) {   
     
    }

    ngAfterContentInit (){
    // currentChannel no llega hasta este evento, viene en un input desde la página padre. Cuando se carga la lista
    //se lanza el evento playFromSlide de esta clase para que se ejecute el primer videode la lista
      this.youtubeData.fetchClipsByChannel(this.currentChannel).subscribe(data => { 
              console.log("constructor slides ", data);   
               this.seleccionarVideo(this.currentChannel.clipsList[0]);  
               //prueba para eventos globales
               //this.events.publish('app:close', 'Cargados videos!!!!!!');        
            });   
    
  }
   
   doInfinite(infiniteScroll) {
    if (this.currentChannel.clipsList.length<this.currentChannel.totalClips){
    this.youtubeData.fetchClipsByChannel(this.currentChannel).subscribe(data => { 
      if (data) {
          infiniteScroll.complete();
         }
      });
    }else{
      infiniteScroll.complete();
    }
  }

 

 /**
  * Se define la funcion processRecipe que será luego utilizada desde el padre, el cual recibirá el parámetro event que contendrá la receta
  * Sería algo así como  <recipe-form  (playFromSlide)="play($event)" /> lo que significa que cuando se lance el evento seleccionarVideo del hijo, lo capturará el padre
  * para hacre play. Este evento se puede lanzar por ejemplo en un click de la template del hijo que ejecute la función seleccionarVideo (lanza el evento playFromSlide con el emit)
  * del componente hijo (es este caso el hijo sería recipe-form).  
  * La función playFromSlide devuelve un evento el cual encapsula la url , y en el padre se recoge mediante $event y se invoca a un método del componente padre mandar url al player. 
  * La url estaría en $event
  *
  */
  seleccionarVideo ( clip : YTClipBean): void {
    let url = 'https://www.youtube.com/watch?v='+clip.id;
    this.currentVideo=clip.id;
    this.playFromSlide.emit(url);
  }

 isSelected(clip : YTClipBean):boolean{
  return clip.id === this.currentVideo;
 }

	public get currentVideo(): string {
		return this._currentVideo;
	}

	public set currentVideo(value: string) {
		this._currentVideo = value;
	}
  
}
