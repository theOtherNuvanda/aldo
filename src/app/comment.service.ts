import {Injectable} from '@angular/core';

import {Observable} from 'rxjs/Observable';

import {Comment, DUMMY_COMMENT_TYPE} from './comment';
import {FbService, HttpMethod} from './fb.service';
import {GraphApiError} from './graph-api-error';
import {GraphApiResponse} from './graph-api-response';
import {buildFields} from './util';

/*
 * The Service providing the Comments.
 */

@Injectable()
export class CommentService {
    constructor(protected fbService: FbService) {}

    /*
     * Get a Comment by its id.
     */
    comment(id: string): Observable<Comment> {
        return this.fbService
            .fetch(
                id,
                HttpMethod.Get,
                {fields: buildFields(DUMMY_COMMENT_TYPE)},
                Comment) as Observable<Comment>;
    }

    /*
     * Get all Comments on a certain id.
     *
     * The id may represent an album, event, life event, link, live video, note, 
     * official event, open graph action, open graph object, photo, post, 
     * status, thread, user, video, or another comment.
     */
    comments(id: string): Observable<GraphApiResponse<Comment>> {
        return this.fbService.api(
            id + '/comments',
            HttpMethod.Get,
            {fields: buildFields(DUMMY_COMMENT_TYPE)},
            Comment) as Observable<GraphApiResponse<Comment>>;
    }
}

