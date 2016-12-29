import { Loader } from './../../providers/loader';
import { Component, ViewChild, ElementRef,  } from '@angular/core';
import { NavController, NavParams} from 'ionic-angular';
import { YTChannelBean } from './../../model/YTBean';

//ojo, añadimos el jquery y la librería MediaElement al index (no tiene interface ts)
// y la manera de referenciarla sería esta, con un any para invocar a sus métodos 
// y no pete el compilador!!!! ya que con un any no canta y el js que typescript no conoce, lo deja como está.
// el new MediaElementPlayer() es el objeto de la librería js externa que gestiona el player 
declare var $:any; 
declare var MediaElementPlayer:any;

@Component({
  selector: 'page-player',
  templateUrl: 'player.html'
})

export class PlayerPage {
  @ViewChild ('player') player:ElementRef;
  private _playerId ='player'; 
  private _currentVideo : string='';
  private _playerMediaElement: any;
  private _hiddenSlider: boolean = false;
  private _onPlaying: boolean = false;
  private _currentChannel: YTChannelBean;
  private _mediaElementInitialized: boolean = false;
  private _firstLoad:boolean=true;
  

  public configPlayer : any ={  
    startVolume: 0.6,
    autoplay: true,
    loop: true,
    enableAutosize: true,
    features: ['current','duration','progress','tracks','volume'],
    alwaysShowControls: false,
    iPadUseNativeControls: false,
    iPhoneUseNativeControls: false,
    AndroidUseNativeControls: false,
    alwaysShowHours: false,
    showTimecodeFrameCount: false,
    framesPerSecond: 25,
    enableKeyboard: true,
    pauseOtherPlayers: true,
		clickToPlayPause: true,
   } 

   /**
    * Creates an instance of PlayerPage.
    * 
    * @param {NavController} navCtrl
    * @param {NavParams} navParams
    * 
    * @memberOf PlayerPage
    */ 
   constructor(public navCtrl: NavController, private navParams: NavParams, public loader: Loader ) {
     this.currentChannel = navParams.get('channel'); 
    }
  
  /**
   * Se llama únicamente cuando cargas una página en memoria (push). 
   * Este evento NO se lanza si entras por segunda vez en una vista que ya está cacheada  
   * Aquí hacemos el wraper del <video> a objeto tipo MediaElementPlayer para manejar sus controles y demás, 
   * ya que esta página queda en la pila y no hace falta volver a crear el MediaElementPlayer cada vez. 
   * 
   * @memberOf PlayerPage
   */
  ionViewDidLoad() {
    let self = this;
    //se hace un wraper del component video a MediaElementPlayer con sus propios controles 
    this.configPlayer.success = (mediaElement, originalNode) =>{
                    self.mediaElementInitialized = true;
              }
    this.playerMediaElement = new MediaElementPlayer($('#'.concat(this._playerId)), this.configPlayer );  
    }
 
   
/**
 * Gestiona el play(pause)
 * 
 * @memberOf PlayerPage
 */
  tooglePlay(){
      if (this.onPlaying){
        this.playerMediaElement.pause();
        this.hiddenSlider=false;
      }else{
        this.playerMediaElement.play(); 
        this.hiddenSlider=true;       
      }
      this.onPlaying=!this.onPlaying;
  }

 /**
  * Recibe al url desde el slider y la carga en el player
  * 
  * @param {string} videoURI
  * 
  * @memberOf PlayerPage
  */
  play(videoURI:string){
    /*
     Esta recursividad solamente es para la primera vez que entra, tenemos que asegurarnos que el objeto MediaElementPlayer
     está cargado, para ello en su callback (está definida en el su config) informamos el flag self.mediaElementInitialized 
     a true. En este método hacemos una recursividad hasta que la vble está a true. Cuando sea así, cargamos el primer video 
     de la lista. Este video nos llega a través del evento playFromSlide del slider, que se lanza desde el constructor del componente
     */
     if(this.mediaElementInitialized == true){
       if (this.firstLoad){
         this.loader.loading.dismiss();         
       }
        this.hiddenSlider=!this.firstLoad; 
        this.firstLoad=false; 
        this.onPlaying = true;
        this.currentVideo=videoURI;
        this.playerMediaElement.setSrc(videoURI);
        this.playerMediaElement.play();        
     }else {
       
        var self = this;
        setTimeout(function(){
            self.play(videoURI);            
        },500);
    }

  }

 back(){
    this.navCtrl.pop();
  }


 ngOnDestroy() {
    /*this.playerMediaElement.setSrc('');
    this.playerMediaElement.load();*/
    }

  public get onPlaying(): boolean  {
		return this._onPlaying;
	}

	public set onPlaying(value: boolean ) {
		this._onPlaying = value;
	}


	public get hiddenSlider(): boolean  {
		return this._hiddenSlider;
	}

	public set hiddenSlider(value: boolean ) {
		this._hiddenSlider = value;
	}

  public get playerMediaElement(): any {
		return this._playerMediaElement;
	}

	public set playerMediaElement(value: any) {
		this._playerMediaElement = value;
	}

  public get showChannelThumbail(): boolean  {
		return this._showChannelThumbail;
	}

	public set showChannelThumbail(value: boolean ) {
		this._showChannelThumbail = value;
	}
  private _showChannelThumbail :boolean = true;

	public get currentChannel(): YTChannelBean {
		return this._currentChannel;
	}

	public set currentChannel(value: YTChannelBean) {
		this._currentChannel = value;
	}

 public get mediaElementInitialized(): boolean  {
		return this._mediaElementInitialized;
	}

	public set mediaElementInitialized(value: boolean ) {
		this._mediaElementInitialized = value;
	}

	public get currentVideo(): string {
		return this._currentVideo;
	}

	public set currentVideo(value: string) {
		this._currentVideo = value;
	}

	public get firstLoad(): boolean {
		return this._firstLoad;
	}

	public set firstLoad(value: boolean) {
		this._firstLoad = value;
	}
}
