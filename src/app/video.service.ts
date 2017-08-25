import {Injectable} from '@angular/core';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/pluck';

import {Video, DUMMY_VIDEO_TYPE} from './video';
import {FbService, HttpMethod} from './fb.service';
import {Ressource} from './app';
import {Page} from './page';

/*
 * The Service providing the Pages.
 */

@Injectable()
export class VideoService {
    constructor(protected fbService: FbService) {}

    /*
     * Get a video by its id.
     */
    video(id: string): Promise<Video> {
        return this.fbService
            .fetch(
                id,
                HttpMethod.Get,
                {fields: Object.keys(DUMMY_VIDEO_TYPE)},
                Video)
            .first()
            .toPromise() as Promise<Video>;
    }

    /*
     * Create a new video.
     */
    create(page: Page, link: Ressource): Promise<string> {
        return this.fbService.fetch(
            page.id.toString() + '/videos',
            HttpMethod.Post,
            {
                file_url: link,
                access_token: page.access_token
            })
            .pluck('video_id')
            .first()
            .toPromise() as Promise<string>;
    }
}

