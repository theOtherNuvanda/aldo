import {Injectable} from '@angular/core';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/publishReplay';

import {Profile, DUMMY_PROFILE_TYPE} from './profile';
import {FbService, HttpMethod} from './fb.service';
import {PageService} from './page.service';

/*
 * The Service providing Profiles.
 */

@Injectable()
export class ProfileService {
    constructor(
        protected fbService: FbService,
        protected pageService: PageService) {}

    protected _profile(id: string): Observable<Profile> {
        return this.fbService
            .fetch(
                id,
                HttpMethod.Get,
                {
                    fields: Object.keys(DUMMY_PROFILE_TYPE),
                    metadata: 1
                },
                Profile)
            .map(graphApiObject => graphApiObject as Profile);
    }

    /*
     * Get a Profile by its ID.
     */
    profile(id: string): Observable<Profile> {
        // Need to redo the cacheing here, as we would otherwise mergeMap the 
        // cached instance of Profile the a new instance of a subtype of Profile 
        // every time this Observable is subscribed to.
        return this._profile(id)
            .mergeMap(profile => {
                switch (profile.metadata.type) {
                    case 'page': return this.pageService.page(id);
                    default: return Observable.of(profile);
                }
            });
    }
}

