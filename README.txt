
PARA PLUGIN REBBOT
cordova plugin add https://github.com/fadeit/cordova-plugin-reboot.git
se ejecuta cordova.plugins.Reboot.reboot();
PERO SOLO FURRULA PARA ROOT.

Luego se mete la librería de jquery y mediaelementplayer.js. La mediaElemnt es un wraper del framset que trae youtube
con sus controles propio y demás. como no hay ts para esta librería, mirar el player.js como lo utiliza. 
jauery se declara como any, con lo cual no da error de compilación y el transpilador no lo procesa, así llega al browser tal cual.

utiliza para construir webpack http://blog.enriqueoriol.com/2016/10/intro-a-webpack.html

Se añadió nueva carpeta de workers donde los almaceno y los llevo al www , al igual que el lib
el cambio lo hice en node_modules/@ionic/app-scripts/config 

Se añadió nueva directiva image-cache que se añade a las img y loque hace es buscar en caché la imagen, si está la devuelve y si no está la obtiene, crea blob y la almacena, blob y metainformación

Después el worker lo que hace es "pesar" la cache y si sobrepasa el límite elimina los registros que se han accedido hace más tiempo, dejando almacenados los de acceso más reciente.
Se utiliza indexedBD. En realidad se utiliza el storage de ionic (@ionic/storage). 
Este storage lo que hace es priorizar, si hay sqlite instalado (cordova plugin add cordova-sqlite-storage --save) utiliza este, si no indexeddb y si no localstorage.
La interface es la misma (clave/valor) aunque sea sqlite. Internamente crea una tabla con las dos columnas. Si se quiere utilizar queries, crear tablas y demás, instalar sqlite normal y corriente sin utilizar 
el storage de ionic. Para indexed, ionic crea la BBDD _ionicstorage y la colección _ionickv que es donde se almacenan los pares. En el worker se ve bien, ya que se accede directamente a la colección.

importante-> en android el chromium no registra el service-worker a día de hoy.


Falta
- limpiar la librería de mediaelementplayer
- maquear worker con ES6
- auditoría firebase
- maquear interface

