import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, Events } from 'ionic-angular';

import { UserProvider, DishProvider } from '../../providers/providers';
import { Dish } from '../../models/dish';
import { presentToast, presentLoading } from '../../utils/utils';

@IonicPage()
@Component({
	selector: 'page-dish-detail',
	templateUrl: 'dish-detail.html'
})
export class DishDetailPage {
	dish: Dish;

	private partNameList: string[] = new Array<string>();

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public toastCtrl: ToastController,
		public loadingCtrl: LoadingController,
		public translate: TranslateService,
		public userProvider: UserProvider,
		public dishProvider: DishProvider,
		public events: Events
	) {
		this.translate.get(['PART_PRO', 'PART_GAR', 'PART_SAU']).subscribe(values => {
			this.partNameList[0] = values['PART_PRO'];
			this.partNameList[1] = values['PART_GAR'];
			this.partNameList[2] = values['PART_SAU'];
		});

		events.subscribe('dish:save', () => {
			this.getDishById();
		});
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
		this.getDishById();
	}

	getDishById() {
		let dishId = this.navParams.get('dishId');
		let lang: string = this.translate.getDefaultLang();

		let loading = presentLoading(this.loadingCtrl);
		this.dishProvider.getDishById(dishId, lang).subscribe(
			(res: any) => {
				loading.dismiss();
				this.dish = res.body;

				// Asigna las propiedades del grupo.
				for (let dishPart of this.dish.dishPartList) {
					switch (dishPart.partCode) {
						case 'P':
							dishPart.partName = this.partNameList[0];
							break;
						case 'G':
							dishPart.partName = this.partNameList[1];
							break;
						case 'S':
							dishPart.partName = this.partNameList[2];
							break;
					}

					dishPart.showDetails = true;
					dishPart.icon = 'ios-arrow-up';
				}
			},
			err => {
				loading.dismiss();
				presentToast(this.toastCtrl, err.message);
			}
		);
	}

	openDishSavePage() {
		this.navCtrl.push('DishSavePage', { dishId: this.dish.id });
	}

	/*
	 * Funciones para el agrupamiento.
	 */

	toggleDetails(group) {
		if (group.showDetails) {
			group.showDetails = false;
			group.icon = 'ios-arrow-down';
		} else {
			group.showDetails = true;
			group.icon = 'ios-arrow-up';
		}
	}
}
