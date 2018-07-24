import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController, LoadingController } from 'ionic-angular';

import { DietProvider } from '../../providers/providers';
import { DietType } from '../../models/diet-type';
import { Preference } from '../../models/preference';
import { presentLoading, presentToast } from '../../utils/utils';

@IonicPage()
@Component({
	selector: 'page-diet-type-set',
	templateUrl: 'diet-type-set.html'
})
export class DietTypeSetPage {
	dietTypeList: DietType[];

	preference: Preference;

	// Tipo de dieta seleccionado.
	dietType: DietType;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public viewCtrl: ViewController,
		public toastCtrl: ToastController,
		public loadingCtrl: LoadingController,
		private translate: TranslateService,
		public dietProvider: DietProvider
	) {
		this.preference = this.navParams.get('preference');

		this.getAllDietTypes();
	}

	getAllDietTypes() {
		let loading = presentLoading(this.loadingCtrl);
		this.dietProvider.getAllDietTypes(this.translate.getDefaultLang()).subscribe(
			(res: any) => {
				loading.dismiss();
				this.dietTypeList = res.body;
			},
			err => {
				loading.dismiss();
				presentToast(this.toastCtrl, err.message);
			}
		);
	}

	cancel() {
		this.viewCtrl.dismiss();
	}

	done() {
		if (this.dietType) {
			this.preference.dietType = this.dietType;
		}

		this.viewCtrl.dismiss();
	}
}
