# KidsTV Ionic 2.0.0-rc.3
- Aplicación Ionic2 que consume  [`canal de youtube propio`](https://www.youtube.com/channel/UCb40SExvsnL0Id3jrDBSI9w) para mostrar las listas de producción agregadas con contenido para niños. 
- Contiene visor de videos customizado que bloquea los links a youtube para que no salgan de la app.
- Para el visor se integra librería MediaelementPlayer y JQuery. 
- Caché gestionada con indexedbd través de @ionic/storage
- Se implementa directiva image-cache que gestiona la caché del navegador, almacenando los recursos que la empleen (imágenes) priorizando la caché  en la petición del recurso. Si no disponible, petición online y almacenamiento en caché. 
- Webworker para la gestión de la caché. Parametrizable un límite de MB cacheable y liberando los recursos más antiguos  una vez sobrepasado  

## Pending
- Migrar a Ionic 3
- Reimplementar interfaz gráfica con las nuevos cambios de la versión.
- Reestructuración de la aplicación y mejora en tratamiento de observables
- Implementación de una aplicación master que permita control parental remoto de la app (apagado, temporizador, gestión de   listas de reproducción,...) 
- Limpiar la librería de mediaelementplayer y añadirla al bundle 
- Despliegue en firebase hosting 

## License
Licensed under the MIT Open Source license.
