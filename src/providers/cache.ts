import { Injectable } from '@angular/core';

import { Storage } from '@ionic/storage';


const WEB_WORKER = "workers/web-worker.js";
const OP_AUDITAR_CACHE = "auditCache";

@Injectable()
export class Cache {

  constructor(public storage: Storage ) {
    this.auditaCache();
  }
 

  
  /**
   * Se lanza web-worker que comprueba tamaño de caché y en caso de sobrepasarlo, hace una lipieza óptima borrando 
   * los accedidos hace más tiempo
   * 
   * @memberOf Cache
   */
  auditaCache(){    
    var worker = new Worker(WEB_WORKER);
    worker.postMessage({op:OP_AUDITAR_CACHE, otherParam:1});  
    worker.onmessage = function(event) {
        console.log(event.data);
      };
   
  }
  
  /**
   * Almacena en el storage una entidad con su metainformación
   * 
   * @param {string} id
   * 
   * @memberOf Cache
   */
  public get (id: string):Promise<any>{
    if (this.isUriAbsolute(id)){
     id = encodeURIComponent(id);
   }
    //si es tipo del id es http:// codificamos url para crear string
    return this.storage.get(id).then(
      //se devuelve el valor 
      (cachedItem)=>{
        if (cachedItem){
          
          //almacenamos último acceso
         cachedItem._lastAccess=new Date();
          this.storage.remove(id).then(data=>{
             this.storage.set(id, cachedItem);
          });
          return cachedItem._payload;
        }
        return null;
        }
    );
  }


 /**
  * Método que almacena en el storage clave, valor
  * 
  * @param {string} id
  * @param {*} payload
  * 
  * @memberOf Cache
  */
 public set (id: string, payload : any){
   //let blob:Blob = payload;
  // console.log("Almacenado", id,"Tamaño", blob.size,"Tipo",blob.type);
  console.log("NO ESTÁ, se cachea", id);
   let permanent: boolean= true;
    if (this.isUriAbsolute(id)){
     permanent=false;
   }

   let size = JSON.stringify(payload).length;
   let cacheItem = new CacheItem(
     payload,new Date(), new Date(),permanent,size,payload.etag, encodeURIComponent(id));
   if (this.isUriAbsolute(id)){
     id = encodeURIComponent(id);
   }
   this.storage.set(id, cacheItem);
 }



   /**
    * Comprueba si es una http
    * 
    * @param {string} uri
    * @returns
    * 
    * @memberOf Cache
    */
   isUriAbsolute(uri: string) {
    let expression: any = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
    let regex = new RegExp(expression);
    return uri.match(regex);
  }

}



/**
 * Clase que representa los items almacenados en cache, con el payload uy mete información del mismo 
 * 
 * @export
 * @class CacheItem
 */
export class CacheItem{

 constructor( public _payload:any,
              public _cachedDate:Date,
              public _lastAccess:Date,
              public _permanent:boolean,
              public _size:number,
              public _etag:string,
              public _id:string ){}

}
