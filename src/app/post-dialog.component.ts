import {Component, Input} from '@angular/core';
import {MdDialogRef} from '@angular/material';

import {Observable} from 'rxjs/Observable';

import {Page} from './page';
import {PostService} from './post.service';
import {Ressource} from './app';
import {PostContentType} from './post';

@Component({
    selector: 'post-dialog',
    templateUrl: './_post-dialog.component.html',
    styleUrls: ['./post-dialog.component.css']
})
export class PostDialogComponent {
    constructor(
        protected mdDialogRef: MdDialogRef<Observable<string>>,
        protected postService: PostService) {}

    @Input()
    page: Page;

    /*
     * PostContentType selected by the user.
     */
    contentType = PostContentType.link;

    /*
     * Text entered by the user.
     */
    text = '';

    /*
     * Link entered by the user.
     */
    link = '';

    /*
     * Photo url entered by the user.
     */
    photo?: Ressource;

    /*
     * Video url entered by the user.
     */
    video?: Ressource;

    /*
     * Get the uri of the attachment to be published, if any.
     */
    get ressource(): Ressource|null {
        return this[PostContentType[this.contentType]];
    }

    /*
     * Post to a given String to this Page.
     */
    post() {
        this.mdDialogRef.close(
            this.postService.create(
                this.page,
                this.text,
                this.contentType,
                this.ressource));
    }

    /*
     * Set the PostContentType from the selected tab.
     */
    set selectedIndex(selectedIndex: number) {
        this.contentType = PostContentType[
            [
                'link',
                'photo',
                'video'
            ][selectedIndex]
        ];
    }
}

