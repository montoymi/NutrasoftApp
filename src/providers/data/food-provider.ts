import 'rxjs/add/operator/toPromise';
import { Injectable } from '@angular/core';

import { Api } from '../api/api';
import { RESPONSE_STATUS } from '../../constants/constants';

@Injectable()
export class FoodProvider {
	constructor(public api: Api) {}

	getAllFoods(lang: string) {
		let seq = this.api.get('foods', { lang: lang }).share();

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
