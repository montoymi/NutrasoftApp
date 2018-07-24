import 'rxjs/add/operator/toPromise';
import { Injectable } from '@angular/core';

import { Api } from '../api/api';
import { RESPONSE_STATUS } from '../../constants/constants';

@Injectable()
export class DietProvider {
	constructor(public api: Api) {}

	generateDiet(clientId: number, week: number, day: number, lang: string) {
		let seq = this.api.get('diets', { clientId: clientId, week: week, day: day, lang: lang }).share();

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

	getWeightsByNdbno(ndbno: string, weight: number, lang: string) {
		let seq = this.api.get('diets/weights', { ndbno: ndbno, weight: weight, lang: lang }).share();

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

	getAllDietTypes(lang: string) {
		let seq = this.api.get('diets/diet-types', { lang: lang }).share();

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
