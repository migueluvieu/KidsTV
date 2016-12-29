import { Cache } from './../../providers/cache';
import { Directive, ElementRef} from '@angular/core';
import { Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Http, Headers, ResponseContentType, RequestOptionsArgs} from '@angular/http';

/**
 * Directiva para cachear imágenes. Utiliza el storage de ionic2. 
 * Si es app y tiene instalado sqlLite utiliza este plugin (pero con nomenclatura clave-valor, sin queries). 
 * La ventaja es que no hay límite ya que no deja de ser una BBDD y se mantienen los registos a pesar de reinstalación
 * En browser o en app si no está instalado sqlite busca Indexeddb y localstorage, por ese orden. 
 * El mayor problema que tienen es límite de los navegadores.
 * 
 * Uso :
 * <img src="https://jpeg.org/images/jpeg-home.jpg" height="420" width="420"  image-cache>
 * 
 * Simplemente se añade al app.modules.ts-> declarations: [ImageCache] y ya se pueden utilizar en toda la app
 */
@Directive({
	selector: '[image-cache]'
})
export class ImageCache {
  constructor(private el: ElementRef, 
              private platform: Platform, 
              private http:Http, 
              public storage: Storage,
              public cache:Cache) {
  }
 
  /**
  * hook que se llamado después ngAfterContentInit.
  */
  ngAfterViewInit() {

    console.log('*******ngAfterViewInit')
    this.checkCache(this.el.nativeElement.src);    
 }

  /**
   * Comprueba si la imagen está cacheada. Si lo está, devuelve el churro base64 que está en el Storage y 
   * se lo pasa al src del <img>    
   * Si no lo está, invoca a la imagen desde el servidor, genera el churro b64, lo almacena en storage y 
   * se lo pasa al src del <img>    
   */

  checkCache(imageSrc: string) {
    if (this.isEmpty(imageSrc)) {
      return;
    }
    // Comprueba si es una URL http
    if (this.isUriAbsolute(imageSrc)) {
        // Comprueba si la imagen está cacheada          
      //this.storage.get(encodeURIComponent(imageSrc)).then((data) => {
     this.cache.get(imageSrc).then((data) => {
      if (data) {
         console.log('está cached',imageSrc);
        // Se hace binding al src del componnte
        this.setImageToElement(this.el, data);
      } else {
        console.log(imageSrc,'Not cached->to cache');
       // No está en caché, se codifica imagen de la url a base64 y cachea
         this.setImageBase64String(this.el, imageSrc);
      }
      }, (error) => {
          console.log("ERROR CHECKCACHÉ",error);          
         //this.setImageBase64String(this.el, imageSrc);
        });       
      }
  }

 /**
  * Se codifica imagen a b64, se almacena en storage y se pasa al src del elemento
  */
  setImageBase64String(el: ElementRef, imageSrc: string) {
    //Se codifica la imagen de la URL a base64
    this.getImageBase64String(imageSrc).then( (imageBase64String: any) => {
      // se almacena en caché
      //this.storage.set(encodeURIComponent(imageSrc), imageBase64String);
      this.cache.set(imageSrc, imageBase64String);
      //se hace el binding  
      this.setImageToElement(el, imageBase64String);
    }, (err) => {
      console.log(err);
    });
  }

 /**
  * Codifica la imagen a base64 a través de un fileReader
  */
  getImageBase64String(url: string): Promise<any> {
    return new Promise( (resolve: any, reject: any) => {
      let requestOptions :RequestOptionsArgs  = {
          responseType: ResponseContentType.Blob,
          headers: new Headers({'Content-Type': 'application/x-www-form-urlencoded'}),
          body: null
        };

      // se obtiene la imagen desde la url
      this.http.get(url, requestOptions).subscribe(
        (res) => {             
            if (res.ok){
              //para codificar a base64 no nos vale res.blob(), ya que devuelve uri del tipo blob:http%3A//localhost%3A8383/568233a1-8b13-48b3-84d5-cca045ae384f
              // que es un "enlace" a la imagen pero en la caché del navegador. PEro lo que viene que es del tipo blob:http%3A//localhost%3A8383/568233a1-8b13-48b3-84d5-cca045ae384f
              // que representa los datos que el navegador tiene actualmente en la memoria, de la página actual. No va a estar disponible en otras páginas, 
              //no va a estar disponible en otros navegadores, y no va a estar disponible desde otros equipos.
              // así que utilizamos un filereader que lee esa uri del blob y obtiene su contenido con reader.readAsDataURL 
              // (https://developer.mozilla.org/es/docs/Web/API/FileReader/readAsDataURL) y esto ya devuelve el "churro" base64
              let reader = new FileReader;
               reader.readAsDataURL(res.blob());
               reader.onload = function() {
                let blobAsDataUrl = reader.result;
                resolve(blobAsDataUrl);
              };
            }           
           })
        
        });

}
 
  isUndefined(value: any) {
    return typeof value === 'undefined';
  }

  isEmpty(value: any) {
    return this.isUndefined(value) || value === '' || value === null;
  }

  setImageToElement(el: ElementRef, imageBase64String: string) {   
    el.nativeElement.src = imageBase64String; 
    console.log(el.nativeElement.innerHTML);    
  }

  isUriAbsolute(uri: string) {
    let expression: any = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
    let regex = new RegExp(expression);
    return uri.match(regex);
  }
}