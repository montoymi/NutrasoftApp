import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { IonicPage, NavController, ViewController, ToastController, LoadingController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase';

import { PASSWORD_MIN_LENGTH, PASSWORD_PATTERN, RESPONSE_ERROR } from '../../constants/constants';
import { UserProvider } from '../../providers/providers';
import { User } from '../../models/user';
import { PasswordValidator } from '../../validators/password-validator';
import { presentToast, presentLoading } from '../../utils/utils';

@IonicPage()
@Component({
	selector: 'page-change-password',
	templateUrl: 'change-password.html'
})
export class ChangePasswordPage {
	form: FormGroup;
	passwords: FormGroup;
	validationMessages;

	user: User;

	private requiredPasswordError: string;
	private minLengthPasswordError: string;
	private patternPasswordError: string;
	private requiredConfirmPasswordError: string;
	private areDifferentConfirmPasswordError: string;
	private authWrongPassword: string;
	private changePasswordSuccess: string;

	constructor(
		public navCtrl: NavController,
		public viewCtrl: ViewController,
		public toastCtrl: ToastController,
		public translate: TranslateService,
		public formBuilder: FormBuilder,
		private afAuth: AngularFireAuth,
		public userProvider: UserProvider,
		public loadingCtrl: LoadingController
	) {
		this.translate
			.get([
				'REQUIRED_PASSWORD_ERROR',
				'MIN_LENGTH_PASSWORD_ERROR',
				'PATTERN_PASSWORD_ERROR',
				'REQUIRED_CONFIRM_PASSWORD_ERROR',
				'ARE_DIFFERENT_CONFIRM_PASSWORD_ERROR',
				'AUTH_WRONG_PASSWORD',
				'CHANGE_PASSWORD_SUCCESS'
			])
			.subscribe(values => {
				this.requiredPasswordError = values['REQUIRED_PASSWORD_ERROR'];
				this.minLengthPasswordError = values['MIN_LENGTH_PASSWORD_ERROR'];
				this.patternPasswordError = values['PATTERN_PASSWORD_ERROR'];
				this.requiredConfirmPasswordError = values['REQUIRED_CONFIRM_PASSWORD_ERROR'];
				this.areDifferentConfirmPasswordError = values['ARE_DIFFERENT_CONFIRM_PASSWORD_ERROR'];
				this.authWrongPassword = values['AUTH_WRONG_PASSWORD'];
				this.changePasswordSuccess = values['CHANGE_PASSWORD_SUCCESS'];
			});

		this.user = new User();

		this.validationMessages = {
			currentPassword: [{ type: 'required', message: this.requiredPasswordError }],
			newPassword: [
				{ type: 'required', message: this.requiredPasswordError },
				{ type: 'minlength', message: this.minLengthPasswordError },
				{ type: 'pattern', message: this.patternPasswordError }
			],
			confirmPassword: [{ type: 'required', message: this.requiredConfirmPasswordError }],
			passwords: [{ type: 'areDifferent', message: this.areDifferentConfirmPasswordError }]
		};

		this.buildForm();
	}

	buildForm() {
		this.passwords = new FormGroup(
			{
				newPassword: new FormControl('', Validators.compose([Validators.required, Validators.minLength(PASSWORD_MIN_LENGTH), Validators.pattern(PASSWORD_PATTERN)])),
				confirmPassword: new FormControl('', Validators.required)
			},
			(formGroup: FormGroup) => {
				return PasswordValidator.areEqual(formGroup);
			}
		);

		this.form = this.formBuilder.group({
			currentPassword: ['', Validators.compose([Validators.required])],
			passwords: this.passwords
		});
	}

	prepareSave() {
		const formModel = this.form.value;

		this.user.id = this.userProvider.user.id;
		this.user.password = formModel.currentPassword;
		this.user.newPassword = formModel.passwords.newPassword;
	}

	validateForm(form: FormGroup): boolean {
		if (!form.valid) {
			// Marca los controles como modificados para mostrar los mensajes de error.
			Object.keys(form.controls).forEach(key => {
				form.get(key).markAsDirty();
			});
			Object.keys(this.passwords.controls).forEach(key => {
				this.passwords.get(key).markAsDirty();
			});

			return false;
		}

		return true;
	}

	ionViewCanEnter(): boolean {
		if (!this.userProvider.user) {
			return false;
		}

		return true;
	}

	changePassword() {
		this.prepareSave();

		let user = this.afAuth.auth.currentUser;
		const credential = firebase.auth.EmailAuthProvider.credential(this.userProvider.user.email, this.user.password);

		let loading = presentLoading(this.loadingCtrl);
		user.reauthenticateWithCredential(credential)
			.then(() => {
				// User re-authenticated.
				// Actualiza el password en Firebase.
				user.updatePassword(this.user.newPassword)
					.then(() => {
						// Update successful.
						loading.dismiss();
						presentToast(this.toastCtrl, this.changePasswordSuccess);
						this.viewCtrl.dismiss();
					})
					.catch(err => {
						// An error happened.
						loading.dismiss();
						presentToast(this.toastCtrl, err.message);
					});
			})
			.catch(err => {
				// An error happened.
				loading.dismiss();
				switch (err.code) {
					case RESPONSE_ERROR.AUTH_WRONG_PASSWORD:
						presentToast(this.toastCtrl, this.authWrongPassword);
						break;
					default:
						presentToast(this.toastCtrl, err.message);
						break;
				}
			});
	}

	cancel() {
		this.viewCtrl.dismiss();
	}

	done() {
		if (!this.validateForm(this.form)) {
			return;
		}

		this.changePassword();
	}
}
