import 'rxjs/add/operator/toPromise';
import { Injectable } from '@angular/core';

import { Api } from '../api/api';
import { Plan } from '../../models/plan';
import { User } from '../../models/user';
import { formatISO8601_Z } from '../../utils/utils';
import { RESPONSE_STATUS } from '../../constants/constants';

@Injectable()
export class PlanProvider {
	constructor(public api: Api) {}

	calculatePlan(plan: Plan) {
		plan.beginDate = formatISO8601_Z(plan.beginDate);
		plan.endDate = formatISO8601_Z(plan.endDate);

		let seq = this.api.post('plans/calcs', plan).share();

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

	createPlan(plan: Plan) {
		plan.beginDate = formatISO8601_Z(plan.beginDate);
		plan.endDate = formatISO8601_Z(plan.endDate);

		let seq = this.api.post('plans', plan).share();

		seq.subscribe(
			(res: any) => {
				if (res.status != RESPONSE_STATUS.CREATED) {
					console.info('status', res.status);
				}
			},
			err => {
				console.error('ERROR', err);
			}
		);

		return seq;
	}

	updatePlan(plan: Plan) {
		plan.beginDate = formatISO8601_Z(plan.beginDate);
		plan.endDate = formatISO8601_Z(plan.endDate);

		let seq = this.api.put('plans', plan).share();

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

	deletePlan(id: number) {
		let seq = this.api.delete('plans/' + id).share();

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

	getPlanById(id: number, lang: string) {
		let seq = this.api.get('plans/' + id, { lang: lang }).share();

		seq.subscribe(
			(res: any) => {
				let plan: Plan = res.body;

				plan.beginDate = formatISO8601_Z(plan.beginDate);
				plan.endDate = formatISO8601_Z(plan.endDate);

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

	getClientsByCoachId(coachId: number, lang: string) {
		let seq = this.api.get('plans', { 'coach-id': coachId, lang: lang }).share();

		seq.subscribe(
			(res: any) => {
				let clientList: User[] = res.body;

				for (let client of clientList) {
					for (let plan of client.planList) {
						plan.beginDate = formatISO8601_Z(plan.beginDate);
						plan.endDate = formatISO8601_Z(plan.endDate);
					}
				}

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

	getAllGoals(lang: string) {
		let seq = this.api.get('plans/goals', { lang: lang }).share();

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

	getAllActivities(lang: string) {
		let seq = this.api.get('plans/activities', { lang: lang }).share();

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
