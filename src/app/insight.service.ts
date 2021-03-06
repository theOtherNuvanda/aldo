import {Injectable} from '@angular/core';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/toArray';
import 'rxjs/add/operator/map';

import {FbService, HttpMethod} from './fb.service';
import {buildFields} from './util';
import {
    DUMMY_INSIGHTS_RESULT_TYPE,
    INSIGHTS,
    METRICS,
    InsightsResult,
    Insight
} from './insight';

/*
 * The Service providing the Insights.
 */

@Injectable()
export class InsightService {
    constructor(protected fbService: FbService) {}

    /*
     * Get an Insight for a given ID.
     */
    insight(id: string, insight: string) {
        const result = this.fbService.fetch(
            id + '/insights',
            HttpMethod.Get,
            {
                fields: buildFields(DUMMY_INSIGHTS_RESULT_TYPE),
                metric: Object.keys(METRICS[insight]),
                date_preset: 'yesterday',
            },
            InsightsResult) as Observable<InsightsResult>;
        return result
            .toArray()
            .map(insightsResults => new Insight(
                INSIGHTS[insight],
                METRICS[insight],
                insightsResults));
    }

    /*
     * Get all Insights for a given ID.
     */
    insights(id: string) {
        return Observable
            .from(Object.keys(INSIGHTS))
            .concatMap(insight => this.insight(id, insight));
    }
}

