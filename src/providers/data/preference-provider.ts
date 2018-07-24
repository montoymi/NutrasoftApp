import 'rxjs/add/operator/toPromise';
import { Injectable } from '@angular/core';

import { Api } from '../api/api';
import { Preference } from '../../models/preference';
import { RESPONSE_STATUS } from '../../constants/constants';

@Injectable()
export class PreferenceProvider {
	constructor(public api: Api) {}

	updatePreference(preference: Preference) {
		let seq = this.api.put('preferences', preference).share();

		seq.subscribe(
			(res: any) => {
				if (res.status != RESPONSE_STATUS.OK) {
					console.info('status', res.status);
				}
			},
			err => {
				console.error('ERROR', err);
			}
		);

		return seq;
	}

	getPreferenceByUserId(userId: number, lang: string) {
		let seq = this.api.get('preferences/' + userId, { lang: lang }).share();

		seq.subscribe(
			(res: any) => {
				if (res.status != RESPONSE_STATUS.OK) {
					console.info('status', res.status);
				}
			},
			err => {
				console.error('ERROR', err);
			}
		);

		return seq;
	}
}
