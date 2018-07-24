import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { IonicPage, NavController, NavParams, ViewController, ModalController, ToastController, LoadingController } from 'ionic-angular';

import { UserProvider } from '../../providers/providers';
import { User } from '../../models/user';
import { Item } from '../../models/item';
import { presentToast, presentLoading } from '../../utils/utils';
import { USER_TYPE_COACH, USER_TYPE_CLIENT, USER_NAME_MAX_LENGTH, EMAIL_PATTERN } from '../../constants/constants';

@IonicPage()
@Component({
	//selector: 'page-user-save',
	selector: 'page-signup',
	templateUrl: 'user-save.html'
})
export class UserSavePage {
	form: FormGroup;
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
	private updateUserSuccess: string;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public viewCtrl: ViewController,
		public modalCtrl: ModalController,
		public toastCtrl: ToastController,
		public loadingCtrl: LoadingController,
		public translate: TranslateService,
		public formBuilder: FormBuilder,
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
				'UPDATE_USER_SUCCESS'
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
				this.updateUserSuccess = values['UPDATE_USER_SUCCESS'];
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

		this.user = userProvider.user;

		this.buildForm();

		this.validationMessages = {
			coach: [{ type: 'required', message: this.requiredCoachError }],
			name: [{ type: 'required', message: this.requiredNameError }, { type: 'maxlength', message: this.maxLengthNameError }],
			gender: [{ type: 'required', message: this.requiredGenderError }],
			birthdate: [{ type: 'required', message: this.requiredBirthdateError }],
			email: [{ type: 'required', message: this.requiredEmailError }, { type: 'pattern', message: this.patternEmailError }]
		};
	}

	buildForm() {
		this.form = this.formBuilder.group({
			coach: [this.user.coach ? this.user.coach.name : ''],
			name: [this.user.name, Validators.compose([Validators.required, Validators.maxLength(USER_NAME_MAX_LENGTH)])],
			gender: [this.user.gender, Validators.required],
			birthdate: [this.user.birthdate, Validators.required],
			phone: [this.user.phone],
			email: [{ value: this.user.email, disabled: true }, Validators.compose([Validators.required, Validators.pattern(EMAIL_PATTERN)])]
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
	}

	validateForm(form: FormGroup): boolean {
		if (!form.valid) {
			// Marca los controles como modificados para mostrar los mensajes de error.
			Object.keys(form.controls).forEach(key => {
				form.get(key).markAsDirty();
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

	getPicture() {}

	processWebImage(event) {}

	getProfileImageStyle() {}

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

	updateUser() {
		this.prepareSave();

		let loading = presentLoading(this.loadingCtrl);
		this.userProvider.updateUser(this.user).subscribe(
			(res: any) => {
				loading.dismiss();
				presentToast(this.toastCtrl, this.updateUserSuccess);
				this.viewCtrl.dismiss();
			},
			err => {
				loading.dismiss();
				presentToast(this.toastCtrl, err.message);
			}
		);
	}

	done() {
		if (!this.validateForm(this.form)) {
			return;
		}

		this.updateUser();
	}
}
