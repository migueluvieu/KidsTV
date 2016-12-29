import {Pipe} from '@angular/core';

//OJO-> ahora simplemente se añade al app.modules.ts-> declarations: [] y ya se pueden utilizar en toda la app
@Pipe({
	name: 'shortener'
})
export class ShortenerPipe {
    /**
     * Acorta el la long del título  
     * 
     * @param {string} value
     * @returns
     * 
     * @memberOf ShortenerPipe
     */
	transform(value:string, size:number) {
        if (value && value.length>size){            
         value = value.substring(0,(size-4)).concat('...');
        }
		return value;
	}
}