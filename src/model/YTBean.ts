/**
 * @export
 * @class YTBean
 */
export  class YTBean  {

  constructor(private _id:string, private _title:string,  private _thumbnail:string ) {      
    }

   get id(): string {
    return this._id;
  }

  set id(id:string)  {
    this._id = id;
  }
  get title(): string {
    return this._title;
  }
  set title(title:string)  {
    this._title = title;
  }
  get thumbnail(): string {
    return this._thumbnail;
  }
  set thumbnail(thumbnail:string)  {
    this._thumbnail = thumbnail;
  }
}

/**
 * @export
 * @class YTClipBean
 */
export  class YTClipBean extends YTBean {
   static build (data:any) {
   return new YTClipBean(data.contentDetails.videoId,data.snippet.title,data.snippet.thumbnails.medium.url);
  };

}
/**
 * @export
 * @class YTChannelBean
 */
export  class YTChannelBean extends YTBean  {

  private _clipsList : YTClipBean[] = [];
  private _subscriptionsList: YTChannelBean[] = [];
  private _nextPageToken: string;

  constructor( id:string,title:string,thumbnail:string, private _totalClips : number) {
    super(id,title,thumbnail);
    }

  static build (data:any) {
   return new YTChannelBean(data.id,data.snippet.title,
               data.snippet.thumbnails.medium.url, data.contentDetails.itemCount);
  };
  get clipsList(): YTClipBean[] {
    return this._clipsList;
  }
  set clipsList(clipsList:YTClipBean[])  {
    this._clipsList = clipsList;
  }
  get subscriptionsList(): YTChannelBean[] {
    return this._subscriptionsList;
  }
  set subscriptionsList(subscriptionsList:YTChannelBean[])  {
    this._subscriptionsList = subscriptionsList;
  }
  get totalClips(): number {
    return this._totalClips;
  }
  set totalClips(totalClips:number)  {
    this._totalClips = totalClips;
  }
  get nextPageToken(): string {
    return this._nextPageToken;
  }
  set nextPageToken(nextToken:string)  {
    this._nextPageToken = nextToken;
  }
}


