import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { IonicPage, NavController, NavParams, ModalController, ToastController, LoadingController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';

import { UserProvider } from '../../providers/providers';
import { User } from '../../models/user';
import { MainPage } from '../pages';
import { Item } from '../../models/item';
import { PasswordValidator } from '../../validators/password-validator';
import { presentToast, presentLoading } from '../../utils/utils';
import { USER_TYPE_COACH, USER_TYPE_CLIENT, USER_NAME_MAX_LENGTH, EMAIL_PATTERN, PASSWORD_MIN_LENGTH, PASSWORD_PATTERN, RESPONSE_ERROR } from '../../constants/constants';

@IonicPage()
@Component({
	selector: 'page-signup',
	templateUrl: 'signup.html'
})
export class SignupPage {
	form: FormGroup;
	passwords: FormGroup;
	validationMessages;

	user: User;

	genderList: Item[];

	private genderMale: string;
	private genderFemale: string;
	private requiredCoachError: string;
	private requiredNameError: string;
	private maxLengthNameError: string;
	private requiredGenderError: string;
	private requiredBirthdateError: string;
	private requiredEmailError: string;
	private patternEmailError: string;
	private requiredPasswordError: string;
	private minLengthPasswordError: string;
	private patternPasswordError: string;
	private requiredConfirmPasswordError: string;
	private areDifferentConfirmPasswordError: string;
	private authEmailAlreadyInUse: string;
	private createUserSuccess: string;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public modalCtrl: ModalController,
		public toastCtrl: ToastController,
		public loadingCtrl: LoadingController,
		public translate: TranslateService,
		public formBuilder: FormBuilder,
		private afAuth: AngularFireAuth,
		public userProvider: UserProvider
	) {
		this.translate
			.get([
				'GENDER_MALE',
				'GENDER_FEMALE',
				'REQUIRED_COACH_ERROR',
				'REQUIRED_NAME_ERROR',
				'MAX_LENGTH_NAME_ERROR',
				'REQUIRED_GENDER_ERROR',
				'REQUIRED_BIRTHDATE_ERROR',
				'REQUIRED_EMAIL_ERROR',
				'PATTERN_EMAIL_ERROR',
				'REQUIRED_PASSWORD_ERROR',
				'MIN_LENGTH_PASSWORD_ERROR',
				'PATTERN_PASSWORD_ERROR',
				'REQUIRED_CONFIRM_PASSWORD_ERROR',
				'ARE_DIFFERENT_CONFIRM_PASSWORD_ERROR',
				'AUTH_EMAIL_ALREADY_IN_USE',
				'CREATE_USER_SUCCESS'
			])
			.subscribe(values => {
				this.genderMale = values['GENDER_MALE'];
				this.genderFemale = values['GENDER_FEMALE'];
				this.requiredCoachError = values['REQUIRED_COACH_ERROR'];
				this.requiredNameError = values['REQUIRED_NAME_ERROR'];
				this.maxLengthNameError = values['MAX_LENGTH_NAME_ERROR'];
				this.requiredGenderError = values['REQUIRED_GENDER_ERROR'];
				this.requiredBirthdateError = values['REQUIRED_BIRTHDATE_ERROR'];
				this.requiredEmailError = values['REQUIRED_EMAIL_ERROR'];
				this.patternEmailError = values['PATTERN_EMAIL_ERROR'];
				this.requiredPasswordError = values['REQUIRED_PASSWORD_ERROR'];
				this.minLengthPasswordError = values['MIN_LENGTH_PASSWORD_ERROR'];
				this.patternPasswordError = values['PATTERN_PASSWORD_ERROR'];
				this.requiredConfirmPasswordError = values['REQUIRED_CONFIRM_PASSWORD_ERROR'];
				this.areDifferentConfirmPasswordError = values['ARE_DIFFERENT_CONFIRM_PASSWORD_ERROR'];
				this.authEmailAlreadyInUse = values['AUTH_EMAIL_ALREADY_IN_USE'];
				this.createUserSuccess = values['CREATE_USER_SUCCESS'];
			});

		this.genderList = [
			{
				value: 'M',
				description: this.genderMale
			},
			{
				value: 'F',
				description: this.genderFemale
			}
		];

		this.user = new User();
		this.user.coach = new User();
		this.user.userType = navParams.get('userType');

		this.buildForm();

		this.validationMessages = {
			coach: [{ type: 'required', message: this.requiredCoachError }],
			name: [{ type: 'required', message: this.requiredNameError }, { type: 'maxlength', message: this.maxLengthNameError }],
			gender: [{ type: 'required', message: this.requiredGenderError }],
			birthdate: [{ type: 'required', message: this.requiredBirthdateError }],
			email: [{ type: 'required', message: this.requiredEmailError }, { type: 'pattern', message: this.patternEmailError }],
			password: [
				{ type: 'required', message: this.requiredPasswordError },
				{ type: 'minlength', message: this.minLengthPasswordError },
				{ type: 'pattern', message: this.patternPasswordError }
			],
			confirmPassword: [{ type: 'required', message: this.requiredConfirmPasswordError }],
			passwords: [{ type: 'areDifferent', message: this.areDifferentConfirmPasswordError }]
		};
	}

	buildForm() {
		this.passwords = new FormGroup(
			{
				password: new FormControl('', Validators.compose([Validators.required, Validators.minLength(PASSWORD_MIN_LENGTH), Validators.pattern(PASSWORD_PATTERN)])),
				confirmPassword: new FormControl('', Validators.required)
			},
			(formGroup: FormGroup) => {
				return PasswordValidator.areEqual(formGroup);
			}
		);

		this.form = this.formBuilder.group({
			coach: [''],
			name: ['', Validators.compose([Validators.required, Validators.maxLength(USER_NAME_MAX_LENGTH)])],
			gender: ['', Validators.required],
			birthdate: ['', Validators.required],
			phone: [''],
			email: ['', Validators.compose([Validators.required, Validators.pattern(EMAIL_PATTERN)])],
			passwords: this.passwords
		});

		if (this.user.userType == USER_TYPE_CLIENT) {
			this.form.get('coach').setValidators([Validators.required]);
		}
	}

	prepareSave() {
		const formModel = this.form.value;

		this.user.name = formModel.name;
		this.user.gender = formModel.gender;
		this.user.birthdate = formModel.birthdate;
		this.user.phone = formModel.phone;
		this.user.email = formModel.email;
		this.user.password = formModel.passwords.password;
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

	openUserSearchPage() {
		let modal = this.modalCtrl.create('UserSearchPage', {
			userType: USER_TYPE_COACH
		});
		modal.onDidDismiss(coach => {
			if (coach) {
				this.user.coach = coach;
				this.form.patchValue({ coach: coach.name });
			}
		});
		modal.present();
	}

	doSignup() {
		if (!this.validateForm(this.form)) {
			return;
		}

		this.prepareSave();

		// Crea el usuario en Firebase.
		let loading = presentLoading(this.loadingCtrl);
		this.afAuth.auth
			.createUserWithEmailAndPassword(this.user.email, this.user.password)
			.then(() => {
				// Signup successful.
				this.userProvider.createUser(this.user).subscribe(
					(res: any) => {
						loading.dismiss();
						presentToast(this.toastCtrl, this.createUserSuccess);
						this.navCtrl.setRoot(MainPage);
					},
					err => {
						loading.dismiss();
						presentToast(this.toastCtrl, err.message);
					}
				);
			})
			.catch(err => {
				// An error happened.
				loading.dismiss();
				switch (err.code) {
					case RESPONSE_ERROR.AUTH_EMAIL_ALREADY_IN_USE:
						presentToast(this.toastCtrl, this.authEmailAlreadyInUse);
						break;
					default:
						presentToast(this.toastCtrl, err.message);
						break;
				}
			});
	}
}
