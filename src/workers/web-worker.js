 
var db;
var storeObject;

//ionic crea una BBDD que la llaman _ionicstorage y dentro una colección que denomina _ionickv  
var IONIC = {
    BBDD : "_ionicstorage",
    STORE : "_ionickv"
}

var OP= {
    AUDIT_CACHE: "auditCache",
}

var CACHE= {
    INTERVAL_AUDIT : "60000",
    LIMIT_SIZE : 2000
}



/**
 * Se encarga de recibir y despachar los mensajes recibidos desde la app
 */
 onmessage = function(event) { 
     if (event.data.op===OP.AUDIT_CACHE){
         //auditamos la caché cada intervalo definido
        setInterval(auditCache,CACHE.INTERVAL_AUDIT);
     }
    };



    /**
     * Obtiene el tamaño de la caché y si sobrepasa límite, elimina los registros cuyo acceso sea más antiguo
     */
 auditCache = function (){     
       // por defecto se abre para lectura    
        var req = indexedDB.open(IONIC.BBDD);
        
        req.onupgradeneeded = function (e) {
          postMessage('successfully upgraded db'); 
          db = req.result;             
        };
        
        req.onsuccess = function (e) {
           postMessage('successfully opened db');  
           db = req.result;  
            var size=0;
            var cont=0;
            var transaction = db.transaction([IONIC.STORE]).objectStore(IONIC.STORE).openCursor();
            //se abre cursor sobre el store/colección de keys de ionic y vamos "pesando" cada 
            transaction.onsuccess = function(event){
                    var cursor = event.target.result;
                    if(cursor){
                        size +=cursor.value._size;
                        cont++;
                        cursor.continue();
                    }
                    else{
                        //si sobrepasa límite, borramos aquellos accedidos más antiguos
                        if (cacheOverLimit(size)){
                             postMessage(' Auditoría Caché: necesaria optimización ' + size/1000+ 'Kbs > '+ CACHE.LIMIT_SIZE +'Kbs');
                            optimizeCache(size);
                        }else{
                              postMessage('Auditoría Caché: NO necesaria optimización '+ size/1000+ 'Kbs <'+ CACHE.LIMIT_SIZE+'Kbs');
                        }
                        db.close();
                    }
                };
        };
        req.onerror = function(e) {
          postMessage('ERROR open '+IONIC.BBDD+' '+e.toString()); 
          db.close();   
        }
    }
  
    /**
     * borra de la caché los registros cuya fecha de último acceso sea más antigua
     * 
     * @param {any} currentCacheSize
     */
    optimizeCache = function (currentCacheSize){   
        var req = indexedDB.open(IONIC.BBDD);
        req.onupgradeneeded = function (e) {
          postMessage('successfully upgraded db'); 
          db = req.result;             
        };
        req.onsuccess = function (e) {
           postMessage('successfully opened db');  
           db = req.result;  
           //se abre el store sobre una transacción de la BBDD de ionic para lectura/escritura)           
            storeObject = db.transaction([IONIC.STORE],"readwrite").objectStore(IONIC.STORE);                        
            //se obtienen todos los items del store de ionic y se ordenan por fecha de último acceso
             storeObject.getAll().onsuccess = function(event) {               
                cachedItems = event.target.result;
                cachedItems.sort(function(a, b) {
                    if (a._lastAccess.valueOf() && b._lastAccess.valueOf()){
                     return a._lastAccess.valueOf() - b._lastAccess.valueOf();
                    }
                    return -1;
               });             
               deleteItemsCache(currentCacheSize,cachedItems, 0);
         }           
        };
        req.onerror = function(e) {
          postMessage('ERROR open '+IONIC.BBDD+' '+e.toString()); 
          db.close();   
        }
    }
    

    /**
     * Borra los item ordenados por fecha de acceso asc hasta que la cache no sobrepase el límite
     * 
     * @param {any} currentCacheSize
     * @param {any} cachedItems
     * @param {any} i
     */
    deleteItemsCache = function (currentCacheSize,cachedItems,i){ 
        //se comprueba previamnete si no es de tipo permanente
            if (!cachedItems[i]._permanent){
                currentCacheSize -= cachedItems[i]._size;            
                storeObject.delete(cachedItems[i]._id);
            }
              if (cacheOverLimit (currentCacheSize)){ 
                  i=i+1;
                  deleteItemsCache(currentCacheSize,cachedItems,i)
              }else{
                   postMessage('Liberada caché, total actual ' +(currentCacheSize/1000)+ 'Kbs elementos borrados '+ i); 
              }
     }
     

    /**
     * Comprueba si la caché ha sobrepasado el límite
     * 
     * @param {any} size
     */
     cacheOverLimit = function (size){
         return (size/1000)>CACHE.LIMIT_SIZE
     }