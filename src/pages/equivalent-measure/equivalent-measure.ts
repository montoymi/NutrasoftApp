import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController, LoadingController } from 'ionic-angular';

import { UserProvider, DietProvider } from '../../providers/providers';
import { DishPartFood } from '../../models/dish-part-food';
import { Weight } from '../../models/weight';
import { presentToast, presentLoading } from '../../utils/utils';

@IonicPage()
@Component({
	selector: 'page-equivalent-measure',
	templateUrl: 'equivalent-measure.html'
})
export class EquivalentMeasurePage {
	dishPartFood: DishPartFood;
	weightList: Weight[];

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public viewCtrl: ViewController,
		public toastCtrl: ToastController,
		public loadingCtrl: LoadingController,
		public translate: TranslateService,
		public userProvider: UserProvider,
		public dietProvider: DietProvider
	) {
		this.dishPartFood = this.navParams.get('dishPartFood');
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
		this.getWeightsByNdbno();
	}

	getWeightsByNdbno() {
		let lang: string = this.translate.getDefaultLang();

		let loading = presentLoading(this.loadingCtrl);
		this.dietProvider.getWeightsByNdbno(this.dishPartFood.food.ndbNo, this.dishPartFood.weight, lang).subscribe(
			(res: any) => {
				loading.dismiss();
				this.weightList = res.body;
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

	done(weight: Weight) {
		this.viewCtrl.dismiss(weight);
	}
}
