import {Injectable} from '@angular/core';

import {Observable} from 'rxjs/Observable';

import {Photo, DUMMY_PHOTO_TYPE} from './photo';
import {FbService, HttpMethod} from './fb.service';
import {Ressource} from './app';
import {Page} from './page';

/*
 * The Service providing the Photos.
 */

@Injectable()
export class PhotoService {
    constructor(protected fbService: FbService) {}

    /*
     * Get a Photo by its id.
     */
    photo(id: string): Observable<Photo> {
        return this.fbService
            .fetch(
                id,
                HttpMethod.Get,
                {fields: Object.keys(DUMMY_PHOTO_TYPE)},
                Photo) as Observable<Photo>;
    }

    /*
     * Create a new Photo on a Page.
     */
    create(
        page: Page,
        ressource: Ressource,
        caption?: string
    ): Observable<{
        storyId: string;
        attachmentId: string;
    }> {
        return this.fbService.call(
            page.id.toString() + '/photos',
            HttpMethod.Post,
            {
                caption: caption,
                url: ressource,
                access_token: page.access_token
            })
            .map(({
                id,
                post_id
            }: {
                id: string;
                post_id: string;
            }) => ({
                storyId: post_id,
                attachmentId: id
            }));
    }
}
