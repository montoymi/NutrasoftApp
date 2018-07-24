import 'rxjs/add/operator/toPromise';
import { Injectable } from '@angular/core';

import { Api } from '../api/api';
import { User } from '../../models/user';
import { formatISO8601_Z } from '../../utils/utils';
import { RESPONSE_STATUS } from '../../constants/constants';

@Injectable()
export class UserProvider {
	user: User;

	constructor(public api: Api) {}

	createUser(user: User) {
		user.birthdate = formatISO8601_Z(user.birthdate);

		let seq = this.api.post('users', user).share();

		seq.subscribe(
			(res: any) => {
				if (res.status == RESPONSE_STATUS.CREATED) {
					this.loggedIn(res.body);
				} else {
					console.info('status', res.status);
				}
			},
			err => {
				console.error('ERROR', err);
			}
		);

		return seq;
	}

	updateUser(user: User) {
		user.birthdate = formatISO8601_Z(user.birthdate);

		let seq = this.api.put('users', user).share();

		seq.subscribe(
			(res: any) => {
				if (res.status == RESPONSE_STATUS.OK) {
					this.loggedIn(res.body);
				} else {
					console.info('status', res.status);
				}
			},
			err => {
				console.error('ERROR', err);
			}
		);

		return seq;
	}

	getUserByEmail(email: string) {
		let seq = this.api.get('users/' + email).share();

		seq.subscribe(
			(res: any) => {
				if (res.status == RESPONSE_STATUS.OK) {
					// Es nulo cuando se invoca desde onAuthStateChanged
					// luego de createUserWithEmailAndPassword y antes de
					// crear el usuario en la app.
					if (!res.body) {
						return;
					}

					this.loggedIn(res.body);
				} else {
					console.info('status', res.status);
				}
			},
			err => {
				console.error('ERROR', err);
			}
		);

		return seq;
	}

	getUsersByUserType(userType: string) {
		let params: { 'user-type': string } = {
			'user-type': userType
		};

		let seq = this.api.get('users', params).share();

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

	/**
	 * Log the user out, which forgets the session
	 */
	logout() {
		this.user = null;
	}

	/**
	 * Process a login/signup response to store user data
	 */
	loggedIn(user: User) {
		console.info('loggedIn: ' + user.email);
		user.birthdate = formatISO8601_Z(user.birthdate);
		this.user = user;
	}
}
