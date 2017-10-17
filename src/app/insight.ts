import {DataSource} from '@angular/cdk/collections';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import {
    GraphApiObject,
    GraphApiObjectType,
    DUMMY_GRAPH_API_OBJECT_TYPE
} from './graph-api-object';

/*
 * Classes related to handling Facebook page insights.
 */

/*
 * A single Value for any particular Metric.
 */
export type Value = number | {[key: string]: number};

/*
 * A single InsightsValue, as returned by the Facebook API.
 */
export interface InsightsValueType {
    end_time: string;
    value: Value;
}

/*
 * A single InsightsResult, as returned by the Facebook API.
 */
export interface InsightsResultType extends GraphApiObjectType {
    description: string;
    name: string;
    period: string;
    title: string;
    values: InsightsValueType[];
}

/*
 * A single InsightsValue, as used internally.
 */
export class InsightsValue {
    constructor(kwargs: InsightsValueType) {
        Object.assign(this, kwargs);
    }

    get endTime() {
        return new Date(this.end_time);
    }
}
export interface InsightsValue extends InsightsValueType {}

/*
 * A single InsightsResult, as used internally.
 */
export class InsightsResult extends GraphApiObject {
    constructor(kwargs: InsightsResultType) {
        super(kwargs);
        this.values = kwargs.values.map(
            insightsValueType => new InsightsValue(insightsValueType));
    }

    values: InsightsValue[];
}
export interface InsightsResult extends InsightsResultType {}

/*
 * A Facebook Page Metric.
 *
 * This class represents a single Metric, with a single Value, as used 
 * internally.
 */
export class Metric {
    constructor(
        public name: string,
        public description: string,
        public categories?: {[key: string]: string}) {}

    /*
     * Daily datapoint.
     *
     * Datapoint containing data for yesterday. This will always refer to the 24 
     * hours before the most recent T07:00:00+0000.
     */
    public day?: Value

    /*
     * Weekly datapoint.
     *
     * Datapoint containing data for the last seven days. This will always refer 
     * to the 168 hours before the most recent T07:00:00+0000.
     */
    public week?: Value

    /*
     * Monthly datapoint.
     *
     * Datapoint containing data for the last four weeks. This will always refer 
     * to the 672 hours before the most recent T07:00:00+0000.
     */
    public days_28?: Value
}

/*
 * A Facebook Page Insight.
 *
 * This is the class used internally wherever Insights are needed, for the 
 * simple reason, that it (unlike the above classes), represents the data in 
 * a sane way.
 *
 * This is meant to be created by the InsightsService, its input needs to be 
 * formatted in a very particular way, it will not work with any set of 
 * InsightsResults.
 */
export class Insight extends DataSource<any> {
    constructor(
        public description: string,
        metrics: {[key: string]: Metric},
        data: InsightsResult[]
    ) {
        super();

        this.data = metrics;

        for (const e of data) {
            this.data[e.name][e.period] = e.values[0].value;
        }
    }

    data: {[key: string]: Metric};

    connect(): Observable<Metric[]> {
        // Filter by simple Metrics, complex Metrics are not yet supported.
        return Observable.of(
            Object.keys(this.data)
                .map(key => this.data[key])
                .filter(metric =>
                    !metric.categories && (
                        metric.day || metric.week || metric.days_28)));
    }

    disconnect() {}
}

/*
 * The simplest valid InsightsResultType.
 *
 * This exists, so the InsightsService can use it to check which fields to 
 * request from Facebook, thus theoretically allowing adding a field to 
 * InsightsResult without changing InsightsService.
 *
 * In practice it is hard to imagine a likely scenario, where this would happen, 
 * without Facebook completely changing Insights, forcing both classes to be 
 * rewritten anyways, but its nice and regular to have this constant for all the 
 * classes that extend GraphApiObject.
 */
export const DUMMY_INSIGHTS_RESULT_TYPE: InsightsResultType = {
    ...DUMMY_GRAPH_API_OBJECT_TYPE,
    description: '',
    name: '',
    period: '',
    title: '',
    values: [] as InsightsValueType[]
}

/*
 * The sources for likes.
 *
 * This contains descriptions for the different sources of Page likes.
 *
 * TODO Add descriptions.
 */
const PAGE_LIKE_SOURCES = {
    'page_suggestion': "LOREM IPSUM",
    'page_timeline': "LOREM IPSUM",
    'ads': "LOREM IPSUM",
    'mobile_ads': "LOREM IPSUM",
    'registration': "LOREM IPSUM",
    'mobile': "LOREM IPSUM",
    'wizard_suggestion': "LOREM IPSUM",
    'profile_connect': "LOREM IPSUM",
    'external_connect': "LOREM IPSUM",
    'recommended_pages': "LOREM IPSUM",
    'favorites': "LOREM IPSUM",
    'api': "LOREM IPSUM",
    'page_browser': "LOREM IPSUM",
    'mobile_page_browser': "LOREM IPSUM",
    'hovercard': "LOREM IPSUM",
    'search': "LOREM IPSUM",
    'page_profile': "LOREM IPSUM",
    'ticker': "LOREM IPSUM",
    'like_story': "LOREM IPSUM",
    'feed_chaining': "LOREM IPSUM",
    'all_category_pyml': "LOREM IPSUM",
    'page_suggestions_on_liking': "LOREM IPSUM",
    'mobile_page_suggestions_on_liking': "LOREM IPSUM",
    'fan_context_story': "LOREM IPSUM",
    'sponsored_story': "LOREM IPSUM",
    'page_invite_escape_hatch_finch': "LOREM IPSUM",
    'page_admin_num_posts': "LOREM IPSUM",
    'page_admin_num_posts_by_type': "LOREM IPSUM",
    'timeline_like_chaining': "LOREM IPSUM",
    'pagelike_adder_for_reactivated_users': "LOREM IPSUM"
}

/*
 * The types of negative Feedback.
 *
 * This contains descriptions for the different types of negative feedback.
 *
 * TODO Add descriptions.
 */
const NEGATIVE_FEEDBACK_TYPES = {
    'hide_clicks': "LOREM IPSUM",
    'hide_all_clicks': "LOREM IPSUM",
    'report_spam_clicks': "LOREM IPSUM",
    'unlike_page_clicks': "LOREM IPSUM",
}

/*
 * The types of positive Feedback.
 *
 * This contains descriptions for the different types of positive feedback.
 *
 * TODO Add descriptions.
 */
const POSITIVE_FEEDBACK_TYPES = {
    'like': "LOREM IPSUM",
    'comment': "LOREM IPSUM",
    'link': "LOREM IPSUM",
    'answer': "LOREM IPSUM",
    'claim': "LOREM IPSUM",
    'rsvp': "LOREM IPSUM"
}

/*
 * The types of Story.
 *
 * This contains descriptions for the different Story types.
 */
const PAGE_STORY_TYPES = {
    'checkin': "Nutzer, die da waren",
    'coupon': "Eingelöste Coupons",
    'event': "Reservierungen",
    'fan': "Gefällt-Mir-Angaben",
    'mention': "Erwähnungen",
    'page post': "Posts von Seiten",
    'question': "Beantwortete Fragen",
    'user post': "Posts von Nutzern",
    'other': "Andere"
}

/*
 * The types of Page tabs.
 *
 * This contains descriptions for the different types of tabs.
 *
 * TODO Add descriptions.
 */
const TAB_TYPES = {
    'allactivity': "LOREM IPSUM",
    'app': "LOREM IPSUM",
    'info': "LOREM IPSUM",
    'insights': "LOREM IPSUM",
    'likes': "LOREM IPSUM",
    'locations': "LOREM IPSUM",
    'photos': "LOREM IPSUM",
    'photos_albums': "LOREM IPSUM",
    'photos_stream': "LOREM IPSUM",
    'profile': "LOREM IPSUM",
    'profile_info': "LOREM IPSUM",
    'profile_likes': "LOREM IPSUM",
    'profile_photos': "LOREM IPSUM",
    'timeline': "LOREM IPSUM",
    'events': "LOREM IPSUM",
    'videos': "LOREM IPSUM",
    'wall': "LOREM IPSUM"
}

/*
 * The INSIGHTS currently supported.
 */
export const INSIGHTS = {
    stories: "Posts",
    impressions: "Eindrücke",
    engagement: "Interaktionen"
}

/*
 * The METRICS currently supported for each Insight.
 */
export const METRICS = {
    stories: {
        page_stories: new Metric(
            "Meldungen",
            "Die Anzahl der generierten Meldungen zu deinem Seitenbeitrag."),
        page_stories_by_story_type: new Metric(
            "Meldungen, nach Meldungsart",
            "Die Anzahl der Meldungen zu deiner Seite nach Meldungsart.",
            PAGE_STORY_TYPES),
        page_storytellers_by_story_type: new Metric(
            "Nutzer die darüber sprechen, nach Meldungsart",
            "Die Anzahl der Personen, die über die Seite sprechen nach Art der"
                + " Seitenmeldung.",
            PAGE_STORY_TYPES)
    },
    impressions: {
        page_impressions: new Metric(
            "Eindrücke",
            "Die Gesamtanzahl der Impressionen für jeglichen Content, der mit"
                + " deiner Seite im Zusammenhang steht."),
        page_impressions_unique: new Metric(
            "Erreichte Nutzer",
            "Die Anzahl der Personen, die jeglichen Content im Zusammenhang mit"
                + " deiner Seite gesehen haben."),
        page_impressions_paid: new Metric(
            "Bezahlte Eindrücke",
            "Die Anzahl der Impressionen für eine Sponsored Story oder"
                + " Werbeanzeige, die auf deine Seite verweist."),
        page_impressions_paid_unique: new Metric(
            "Bezahlte Nutzer",
            "Anzahl der Personen, die eine Sponsored Story oder Werbeanzeige zu"
                + " deiner Seite gesehen haben."),
        page_impressions_organic: new Metric(
            "Unbezahlte Eindrücke",
            "So oft wurden deine Beiträge im News Feed, Ticker oder bei"
                + " Besuchen deiner Seite gesehen."),
        page_impressions_organic_unique: new Metric(
            "Unbezahlte Nutzer",
            "Die Anzahl der Personen, die deine Seite besucht oder sie"
                + " beziehungsweise deren Seitenbeiträge im News Feed oder"
                + " Ticker gesehen haben."),
        page_impressions_viral: new Metric(
            "Virale Eindrücke",
            "Die Anzahl der Impressionen für eine von einem Freund über deine"
                + " Seite veröffentlichte Meldung."),
        page_impressions_viral_unique: new Metric(
            "Virale Nutzer",
            "Die Anzahl der Personen, die deine Seite oder einen der Beiträge"
                + " über eine von einem Freund veröffentlichte Meldung gesehen"
                + " haben."),
        page_impressions_by_story_type: new Metric(
            "Eindrücke, nach Meldungsart",
            "Gesamtimpressionen zu Meldungen, die von einem Freund zu deiner"
                + " Seite veröffentlicht wurden, nach Meldungsart.",
            PAGE_STORY_TYPES),
        page_impressions_by_story_type_unique: new Metric(
            "Erreichte Nutzer, nach Meldungsart",
            "Die Anzahl der Personen, die Meldungen gesesen haben, die von"
                + " einem Freund zu deiner Seite veröffentlicht wurden, nach"
                + " Meldungsart.",
            PAGE_STORY_TYPES)
    },
    engagement: {
        page_engaged_users: new Metric(
            "Interagierende Nutzer",
            "Die Anzahl der Personen, die mit deiner Seite interagiert haben."),
        page_post_engagements: new Metric(
            "Beitragsinteragierende Nutzer",
            "So of wurde durch „Gefällt mir“-Angaben, Kommentare, geteilte"
                + " Inhalte usw. mit deinen Beiträgen interagiert."),
        page_consumptions: new Metric(
            "Klicks",
            "Die Anzahl der Klicks auf einen deiner Inhalte."),
        page_consumptions_unique: new Metric(
            "Klickende Nutzer",
            "Die Anzahl der Personen, die einen deiner Inhalte angeklickt"
                + " haben."),
        page_places_checkin_total: new Metric(
            "Check-Ins",
            "So oft wurde dein Ort besucht."),
        page_places_checkin_total_unique: new Metric(
            "Check-In-Nutzer",
            "Die Anzahl der Personen, die deinen Ort besucht haben."),
        page_places_checkin_mobile: new Metric(
            "Check-Ins mobil",
            "So oft wurde dein Ort über ein Mobiltelefon besucht."),
        page_places_checkin_mobile_unique: new Metric(
            "Check-In-Nutzer mobil",
            "Die Anzahl der Personen, die deinen Ort über ein Mobiltelefon"
                + " besucht haben."),
        page_negative_feedback: new Metric(
            "Negatives Feedback",
            "So oft wurde eine negative Handlung vorgenommen."),
        page_negative_feedback_unique: new Metric(
            "Negatives Feedback Nutzer",
            "Die Anzahl der Personen, die eine negative Handlung vorgenommen"
                + " haben."),
        page_negative_feedback_by_type: new Metric(
            "Negatives Feedback, nach Art",
            "So oft wurde eine negative Handlung vorgenommen, aufgeschlüsselt"
                + " nach Art.",
            NEGATIVE_FEEDBACK_TYPES),
        page_negative_feedback_by_type_unique: new Metric(
            "Negatives Feedback Nutzer, nach Art",
            "Die Anzahl der Personen, die eine negative Handlung vorgenommen"
                + " haben, aufgeschlüsselt nach der Art.",
            NEGATIVE_FEEDBACK_TYPES),
        page_positive_feedback_by_type: new Metric(
            "Positives Feedback, nach Art",
            "So oft wurde eine positive Handlung vorgenommen, aufgeschlüsselt"
                + " nach Art.",
            POSITIVE_FEEDBACK_TYPES),
        page_positive_feedback_by_type_unique: new Metric(
            "Positives Feedback Nutzer, nach Art",
            "Die Anzahl der Personen, die eine positive Handlung vorgenommen"
                + " haben, aufgeschlüsselt nach der Art.",
            POSITIVE_FEEDBACK_TYPES)
    }
}

