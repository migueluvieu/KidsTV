import { Cache } from './../providers/cache';
import { Storage } from '@ionic/storage';
import { ImageCache } from './../pages/directivas/image-cache';
import { Loader } from './../providers/loader';
import { ShortenerPipe } from './../pipes/shortener';
import { ChannelsPage } from './../pages/channels/channels';
import { YoutubeService } from './../providers/youtube-service';
import { SlidesPage } from './../pages/slides/slides';
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { PlayerPage } from '../pages/player/player';

@NgModule({
  declarations: [
    MyApp,
    PlayerPage,
    SlidesPage, 
    ChannelsPage,
    ShortenerPipe,
    ImageCache
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    PlayerPage,
    SlidesPage, 
    ChannelsPage
  ],
  providers: [
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    YoutubeService, Loader, Storage, Cache
    ]
})
export class AppModule {}
