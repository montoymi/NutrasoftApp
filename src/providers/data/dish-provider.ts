import 'rxjs/add/operator/toPromise';
import { Injectable } from '@angular/core';

import { Api } from '../api/api';
import { Dish } from '../../models/dish';
import { RESPONSE_STATUS } from '../../constants/constants';
import { ValidateDishParam } from '../../models/validate-dish-param';

@Injectable()
export class DishProvider {
	constructor(public api: Api) {}

	createDish(dish: Dish) {
		let seq = this.api.post('dishes', dish).share();

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

	updateDish(dish: Dish) {
		let seq = this.api.put('dishes', dish).share();

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

	deleteDish(id: number) {
		let seq = this.api.delete('dishes/' + id).share();

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

	getDishById(id: number, lang: string) {
		let seq = this.api.get('dishes/' + id, { lang: lang }).share();

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

	getDishesByCoachId(coachId: number) {
		let seq = this.api.get('dishes', { 'coach-id': coachId }).share();

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

	getAllNutrientRatios() {
		let seq = this.api.get('dishes/nutrient-ratios').share();

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

	validateDish(validateDishParam: ValidateDishParam) {
		let seq = this.api.post('dishes/calcs', validateDishParam).share();

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
