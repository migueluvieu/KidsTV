import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { LoadingController, Loading } from 'ionic-angular';

/*
  Generated class for the Loader provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Loader {
  private _loading: Loading;

  constructor(public loadingCtrl: LoadingController) {
     this.loading = this.loadingCtrl.create({
      content: 'Cargando...'
      });
  }

  public get loading(): Loading {
		return this._loading;
	}

	public set loading(value: Loading) {
		this._loading = value;
	}

}
