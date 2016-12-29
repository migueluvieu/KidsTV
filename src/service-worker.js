//Service worker
//https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API
//la caché que se gestiona es la Appcache
//https://developer.mozilla.org/es/docs/Web/API/Cache


/*********importante-> en android el chromium no registra el service-worker a día de hoy.**//////


//cuando cambiamos la versión, se ejecutará de nuevo el activate. Hay que arrancar de nuevo servidor y desde el chrome, en la pestaña application se pueden
//ver los sw. Aparecerá una opción en naranja para activar la modificación (skipAwaiting). 

// Normalmenmte habría un install que será cuando se cachean los archivos estáticos. Aquí en pricnipio al ser movil esta app
// no aplica, ya los tenemos en local. En el activate lo que se hace es borrar todas las cachés que no sean la current, se supone que quedarán obsoletas
// por ejemplo si tenemos kids-cache-v1 y luego incrementamos a la 2 (kids-cache-v2) al activar el nuevo cambio (volver a instalar el worker), se borrará la kids-cache-v1.




//y el fetch que es el que hace de proxy, para cada peticion comprueba primero si está en la caché current y si no está, hace la petición al servidor.
const CACHE_VERSION = 2;
const CURRENT_CACHE = 'kids-cache-v' + CACHE_VERSION
//todas las llamadas al servidor se cachearán
const BASE_URL = "https://www.googleapis.com/youtube/v3/"




self.addEventListener('activate', (event) => {
  console.log('* SERVICE-WORKER ', 'activate');
  // Se borran las cachés obsoletas-> distintas a la CURRENT_CACHE 
 
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
            if (CURRENT_CACHE !== cacheName){
            // If this cache name isn't present in the array of "expected" cache names, then delete it.
            console.log('* SERVICE-WORKER ', 'borrando caché obsoleta', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// This sample illustrates an aggressive approach to caching, in which every valid response is
// cached and every request is first checked against the cache.
// This may not be an appropriate approach if your web application makes requests for
// arbitrary URLs as part of its normal operation (e.g. a RSS client or a news aggregator),
// as the cache could end up containing large responses that might not end up ever being accessed.
// Other approaches, like selectively caching based on response headers or only caching
// responses served from a specific domain, might be more appropriate for those use cases.
self.addEventListener('fetch', (event) => {
  
  // para peticiones al servidor, se comprueba si está en cache y si no está, se llama al servidor y se cachea respuesta
   if (event.request.url.startsWith(BASE_URL)) { 
    
        event.respondWith(    
          caches.open(CURRENT_CACHE).then((cache) => {
          return cache.match(event.request).then((response) => {
            if (response) {
              // If there is an entry in the cache for event.request, then response will be defined
              // and we can just return it.
               console.log('* SERVICE-WORKER', 'Encontrada en caché  ', event.request.url );
              return response;
            }

            // Otherwise, if there is no entry in the cache for event.request, response will be
            // undefined, and we need to fetch() the resource.
            console.log(' No response for %s found in cache. ' +
              'About to fetch from network...', event.request.url);

            // We call .clone() on the request since we might use it in the call to cache.put() later on.
            // Both fetch() and cache.put() "consume" the request, so we need to make a copy.
            // (see https://fetch.spec.whatwg.org/#dom-request-clone)
            return fetch(event.request.clone()).then((response) => {           
              console.log('* SERVICE-WORKER', 'NO Encontrada en caché, se invoca servidor  ', event.request.url );
              // Optional: add in extra conditions here, e.g. response.type == 'basic' to only cache
              // responses from the same domain. See https://fetch.spec.whatwg.org/#concept-response-type
              if (response.status < 400 /*&& response.type === 'basic'*/) {
                // We need to call .clone() on the response object to save a copy of it to the cache.
                // (https://fetch.spec.whatwg.org/#dom-request-clone)
                cache.put(event.request, response.clone());
              }

              // Return the original response object, which will be used to fulfill the resource request.
              return response;
            });
          }).catch((error) => {
            // This catch() will handle exceptions that arise from the match() or fetch() operations.
            // Note that a HTTP error response (e.g. 404) will NOT trigger an exception.
            // It will return a normal response object that has the appropriate error code set.
            console.error(CURRENT_CACHE,'caching failed:', error);

            throw error;
          });
        })    
      );
   }else {
     //no miramos caché, directamente devolvemos recurso
        event.respondWith(  
           fetch(event.request.clone())
        );
     }
});