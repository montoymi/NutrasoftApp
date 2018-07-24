import 'rxjs/add/operator/toPromise';
import { Injectable } from '@angular/core';

import { Api } from '../api/api';
import { RESPONSE_STATUS } from '../../constants/constants';

@Injectable()
export class MeasurementProvider {
	constructor(public api: Api) {}

	calculateMeasurement(clientId: number) {
		let seq = this.api.get('measurements', { clientId: clientId }).share();

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
