import { Injectable } from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';
import {YTChannelBean, YTClipBean} from './../model/YTBean'


/**
 * Servicio que encapsula los fetch a youtube.
 * Cada llamada devuelve nextoken para la paginación, token a partir del cual nos devolverá los siguientes resultados
 * URL absolutas:
 * Playlist
 * https://www.googleapis.com/youtube/v3/playlists?part=id,snippet,contentDetails&maxResults=50&channelId=UCb40SExvsnL0Id3jrDBSI9w&key=AIzaSyBNrD10tg9jdoeY94_phmJgdeHvU0Tikpc
 * PlayListItems
 * https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&maxResults=50&playlistId=PL4mBk1zJMp6zUidvJWgad3w_Ltl8YykUj&key=AIzaSyBNrD10tg9jdoeY94_phmJgdeHvU0Tikpc
 * Subscripciones
 * https://www.googleapis.com/youtube/v3/subscriptions?part=snippet,contentDetails&maxResults=50&channelId=UCb40SExvsnL0Id3jrDBSI9w&key=AIzaSyBNrD10tg9jdoeY94_phmJgdeHvU0Tikpc
 * Videos del ChannelsPage (this.searchQuery-> sería el input a buscar, un like)
 * https://www.googleapis.com/youtube/v3/search?part=id,snippet&channelId=' + this.CONFIG_YT_API.channelID + '&q=' + this.searchQuery + '&type=video&order=viewCount&maxResults=' + this.CONFIG_YT_API.maxResults + '&key=' + this.CONFIG_YT_API.googleToken
 */

@Injectable()
export class YoutubeService{
  
   public CONFIG_YT_API : any ={
    MAX_RESULTS: '50',    
    GOOGLE_TOKEN:'AIzaSyBNrD10tg9jdoeY94_phmJgdeHvU0Tikpc',
    URL_PLAYLIST:'https://www.googleapis.com/youtube/v3/playlists',
    URL_CLIPS_CHANNEL:'https://www.googleapis.com/youtube/v3/playlistItems'
   }  

  

  constructor(public http: Http) {}
 
 
  /**
   * Método que obtiene los clips de un channel a partir de un token (si viene informado), paginados según MAX_RESULTS
   * 
   * @param {YTChannelBean} channel
   * @returns {Observable<YTChannelBean>}
   * 
   * @memberOf YoutubeService
   */
  fetchClipsByChannel(channel:YTChannelBean): Observable<YTChannelBean> {
  return new Observable(observer => {
            let params: URLSearchParams = new URLSearchParams();
             params.set('part', 'id,snippet,contentDetails');
             params.set('maxResults', this.CONFIG_YT_API.MAX_RESULTS);
             params.set('playlistId', channel.id);
             params.set('key', this.CONFIG_YT_API.GOOGLE_TOKEN);
              if(channel.nextPageToken) {
                params.set('pageToken', channel.nextPageToken);
              }

             this.http.get(this.CONFIG_YT_API.URL_CLIPS_CHANNEL, {search: params})
              .map(res => res.json())
              .subscribe(data => {  
                console.log('fetchClipsByChannel',data);
                if (data) {   
                  channel.clipsList = channel.clipsList.concat(data.items.map((item)=>{ 
                  return YTClipBean.build(item);
                }));
                channel.nextPageToken = data.nextPageToken;
                observer.next(channel);
                }
            });
     }
  )}

  
 /**
  * Método que devuelve las playlist públicas de un channel a partir de un token (si viene informado), paginados según MAX_RESULTS 
  * 
  * @param {YTChannelBean} channel
  * @returns {Observable<YTChannelBean>}
  * 
  * @memberOf YoutubeService
  */
 fetchPlayListByChannel(channel:YTChannelBean): Observable<YTChannelBean> {
  return new Observable(observer => {
             let params: URLSearchParams = new URLSearchParams();
             params.set('part', 'id,snippet,contentDetails');
             params.set('maxResults', this.CONFIG_YT_API.MAX_RESULTS);
             params.set('channelId', channel.id);
             params.set('key', this.CONFIG_YT_API.GOOGLE_TOKEN);
            if(channel.nextPageToken) {
               params.set('pageToken', channel.nextPageToken);
            }
            /*let url ='https://www.googleapis.com/youtube/v3/playlists?part=id,snippet,contentDetails&maxResults=' + this.CONFIG_YT_API.maxResults + '&channelId=' + channel.id +'&key=' + this.CONFIG_YT_API.googleToken;
            if(channel.nextPageToken) {
              url += '&pageToken=' + channel.nextPageToken;
            }*/

            this.http.get(this.CONFIG_YT_API.URL_PLAYLIST, {search: params})
              .map(res => res.json())
              .subscribe(data => { 
                if (data) {   
                channel.subscriptionsList = channel.subscriptionsList.concat(data.items.map((item)=>{
                  return YTChannelBean.build(item);
                }));
                channel.nextPageToken = data.nextPageToken;
                observer.next(channel);
                }
            });
     }
  )}



}
