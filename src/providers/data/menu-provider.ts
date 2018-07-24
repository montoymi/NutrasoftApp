import 'rxjs/add/operator/toPromise';
import { Injectable } from '@angular/core';

import { Api } from '../api/api';
import { Menu } from '../../models/menu';
import { RESPONSE_STATUS } from '../../constants/constants';

@Injectable()
export class MenuProvider {
	constructor(public api: Api) {}

	createMenu(menu: Menu) {
		let seq = this.api.post('menus', menu).share();

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

	updateMenu(menu: Menu) {
		let seq = this.api.put('menus', menu).share();

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

	deleteMenu(id: number) {
		let seq = this.api.delete('menus/' + id).share();

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

	getNextMenu(coachId: number, dietTypeId: number) {
		let seq = this.api.get('menus/next', { 'coach-id': coachId, 'diet-type-id': dietTypeId }).share();

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

	getMenuById(id: number, lang: string) {
		let seq = this.api.get('menus/' + id, { lang: lang }).share();

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

	getDietTypesByCoachId(coachId: number, lang: string) {
		let seq = this.api.get('menus', { 'coach-id': coachId, lang: lang }).share();

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

	getAllMeals(lang: string) {
		let seq = this.api.get('menus/meals', { lang: lang }).share();

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
