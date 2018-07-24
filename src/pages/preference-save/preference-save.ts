import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IonicPage, NavController, NavParams, ViewController, ModalController, ToastController, LoadingController, Events } from 'ionic-angular';

import { UserProvider, PreferenceProvider } from '../../providers/providers';
import { Preference } from '../../models/preference';
import { ExcludedFood } from '../../models/excluded-food';
import { presentToast, presentLoading } from '../../utils/utils';

@IonicPage()
@Component({
	selector: 'page-preference-save',
	templateUrl: 'preference-save.html'
})
export class PreferenceSavePage {
	form: FormGroup;

	preference: Preference;

	private updatePreferenceSuccess: string;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public viewCtrl: ViewController,
		public modalCtrl: ModalController,
		public toastCtrl: ToastController,
		public loadingCtrl: LoadingController,
		public translate: TranslateService,
		public formBuilder: FormBuilder,
		public userProvider: UserProvider,
		public preferenceProvider: PreferenceProvider,
		public events: Events
	) {
		this.translate.get(['UPDATE_PREFERENCE_SUCCESS']).subscribe(values => {
			this.updatePreferenceSuccess = values['UPDATE_PREFERENCE_SUCCESS'];
		});
	}

	buildForm() {
		this.form = this.formBuilder.group({
			dietType: [this.preference.dietType.name],
			mealCount: [this.preference.mealCount]
		});
	}

	prepareSave() {
		const formModel = this.form.value;

		this.preference.mealCount = formModel.mealCount;
	}

	ionViewCanEnter(): boolean {
		if (!this.userProvider.user) {
			return false;
		}

		return true;
	}

	// Runs when the page has loaded. This event is NOT fired on
	// entering a view that is already cached.
	ionViewDidLoad() {
		this.getPreferenceByUserId();
	}

	getPreferenceByUserId() {
		let userId = this.userProvider.user.id;
		let lang: string = this.translate.getDefaultLang();

		this.preferenceProvider.getPreferenceByUserId(userId, lang).subscribe(
			(res: any) => {
				this.preference = res.body;

				if (!this.preference.excludedFoodList) {
					this.preference.excludedFoodList = new Array<ExcludedFood>();
				}

				this.buildForm();
			},
			err => {
				presentToast(this.toastCtrl, err.message);
			}
		);
	}

	openDietTypeSetPage() {
		let modal = this.modalCtrl.create('DietTypeSetPage', {
			preference: this.preference
		});
		modal.onDidDismiss(() => {
			this.form.patchValue({ dietType: this.preference.dietType.name });
		});
		modal.present();
	}

	openFoodAdd2Page() {
		let modal = this.modalCtrl.create('FoodAdd2Page', {
			excludedFoodList: this.preference.excludedFoodList
		});
		modal.onDidDismiss(() => {
			//this.validateFoods();
		});
		modal.present();
	}

	removeExcludedFood(preference: Preference, excludedFood: ExcludedFood) {
		let excludedFoodList: ExcludedFood[] = preference.excludedFoodList;
		let index: number = excludedFoodList.indexOf(excludedFood);

		if (index !== -1) {
			excludedFoodList.splice(index, 1);
		}
	}

	updatePreference() {
		this.prepareSave();

		let loading = presentLoading(this.loadingCtrl);
		this.preferenceProvider.updatePreference(this.preference).subscribe(
			(res: any) => {
				loading.dismiss();
				presentToast(this.toastCtrl, this.updatePreferenceSuccess);
				this.preference = res.body;
				this.events.publish('preference:save');
				this.viewCtrl.dismiss();
			},
			err => {
				loading.dismiss();
				presentToast(this.toastCtrl, err.message);
			}
		);
	}

	done() {
		this.updatePreference();
	}
}
