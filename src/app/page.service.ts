import {Injectable} from '@angular/core';
import {Http} from '@angular/http';

import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import 'rxjs/add/operator/switchMap';

import {Page, EMPTY_PAGE} from './page';
import {FbService, HttpMethod} from './fb.service';
import {GraphApiError} from './graph-api-error';

/*
 * The Service providing the Pages.
 */

@Injectable()
export class PageService {
    constructor(private fbService: FbService) {}

    /*
     * Perform a get request for a Page on a given path.
     */
    get(path: String, params = {}): Observable<Page> {
        return this.fbService.call(path, HttpMethod.Get, {
            fields: Object.keys(EMPTY_PAGE), 
            ...params
        });
    }

    /*
     * Get all Pages of the user.
     */
    getPages(after?: String) { return this.get('me/accounts'); }

    /*
     * Get a Page by its ID.
     */
    getPage(id: number) { return this.get(id.toString()).first().toPromise(); }
}

