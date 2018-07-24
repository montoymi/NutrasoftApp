import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, NavParams, PopoverController, ModalController, ToastController, LoadingController, Platform } from 'ionic-angular';
import { WheelSelector } from '@ionic-native/wheel-selector';

import { UserProvider, DietProvider } from '../../providers/providers';
import { Menu } from '../../models/menu';
import { DishPartFood } from '../../models/dish-part-food';
import { Weight } from '../../models/weight';
import { presentToast, presentLoading, round, buildMenuName } from '../../utils/utils';
import { RESPONSE_ERROR } from '../../constants/constants';

@IonicPage()
@Component({
	selector: 'page-diet',
	templateUrl: 'diet.html'
})
export class DietPage {
	menu: Menu;

	totalPro: number;
	totalCho: number;
	totalFat: number;
	totalEnerg: number;

	private weekText: string;
	private dayNameList: string[] = new Array<string>();
	private generateDietTitle: string;
	private selectorData;

	private dietPlanNotFound: string;
	private dietMenuNotFound: string;

	// Permite verificar si se ejecuta en el dispositivo. En el navegador ocurre
	// el error cordova_not_available.
	isDevice: boolean;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public popoverCtrl: PopoverController,
		public modalCtrl: ModalController,
		public toastCtrl: ToastController,
		public loadingCtrl: LoadingController,
		public translate: TranslateService,
		public userProvider: UserProvider,
		public dietProvider: DietProvider,
		public selector: WheelSelector,
		private platform: Platform
	) {
		this.isDevice = !(this.platform.is('core') || this.platform.is('mobileweb'));

		this.translate.get(['GENERATE_DIET_TITLE', 'DIET_PLAN_NOT_FOUND', 'DIET_MENU_NOT_FOUND']).subscribe(values => {
			this.generateDietTitle = values['GENERATE_DIET_TITLE'];
			this.dietPlanNotFound = values['DIET_PLAN_NOT_FOUND'];
			this.dietMenuNotFound = values['DIET_MENU_NOT_FOUND'];
		});

		this.translate.get(['WEEK', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']).subscribe(values => {
			this.weekText = values['WEEK'];
			this.dayNameList[0] = values['MONDAY'];
			this.dayNameList[1] = values['TUESDAY'];
			this.dayNameList[2] = values['WEDNESDAY'];
			this.dayNameList[3] = values['THURSDAY'];
			this.dayNameList[4] = values['FRIDAY'];
			this.dayNameList[5] = values['SATURDAY'];
			this.dayNameList[6] = values['SUNDAY'];
		});

		this.selectorData = {
			weeks: [
				{ value: 1, description: this.weekText + ' 1' },
				{ value: 2, description: this.weekText + ' 2' },
				{ value: 3, description: this.weekText + ' 3' },
				{ value: 4, description: this.weekText + ' 4' }
			],
			days: [
				{ value: 1, description: this.dayNameList[0] },
				{ value: 2, description: this.dayNameList[1] },
				{ value: 3, description: this.dayNameList[2] },
				{ value: 4, description: this.dayNameList[3] },
				{ value: 5, description: this.dayNameList[4] },
				{ value: 6, description: this.dayNameList[5] },
				{ value: 7, description: this.dayNameList[6] }
			]
		};
	}

	ionViewCanEnter(): boolean {
		if (!this.userProvider.user) {
			return false;
		}

		return true;
	}

	presentPopover(event: Event) {
		let popover = this.popoverCtrl.create('PopoverPage');
		popover.present({ ev: event });
	}

	doGenerateDiet() {
		if (this.isDevice) {
			// El selector solo funciona en el dispositivo mobil.
			this.selector
				.show({
					title: this.generateDietTitle,
					items: [this.selectorData.weeks, this.selectorData.days]
				})
				.then(
					result => {
						let week: number = this.selectorData.weeks[result[0].index].value;
						let day: number = this.selectorData.days[result[1].index].value;

						this.generateDiet(week, day);
					},
					err => console.log(err)
				);
		} else {
			/*
			 * Solo para pruebas en el navegador.
			 */

			let week: number = this.selectorData.weeks[0].value;
			let day: number = this.selectorData.days[0].value;

			this.generateDiet(week, day);
		}
	}

	generateDiet(week: number, day: number) {
		let clientId: number = this.userProvider.user.id;
		let lang: string = this.translate.getDefaultLang();

		let loading = presentLoading(this.loadingCtrl);
		this.dietProvider.generateDiet(clientId, week, day, lang).subscribe(
			(res: any) => {
				loading.dismiss();
				this.menu = res.body;

				buildMenuName(this.menu, this.weekText, this.dayNameList);

				this.totalPro = 0;
				this.totalCho = 0;
				this.totalFat = 0;
				this.totalEnerg = 0;

				// Inicializa propiedades del grupo.
				for (let menuMeal of this.menu.menuMealList) {
					menuMeal.showDetails = true;
					menuMeal.icon = 'ios-arrow-up';

					this.totalPro += +menuMeal.dish.totalPro;
					this.totalCho += +menuMeal.dish.totalCho;
					this.totalFat += +menuMeal.dish.totalFat;
					this.totalEnerg += +menuMeal.dish.totalEnerg;
				}

				this.totalPro = round(this.totalPro, 1);
				this.totalCho = round(this.totalCho, 1);
				this.totalFat = round(this.totalFat, 1);
				this.totalEnerg = round(this.totalEnerg, 0);
			},
			err => {
				loading.dismiss();
				switch (err.error) {
					case RESPONSE_ERROR.DIET_PLAN_NOT_FOUND:
						presentToast(this.toastCtrl, this.dietPlanNotFound);
						break;
					case RESPONSE_ERROR.DIET_MENU_NOT_FOUND:
						presentToast(this.toastCtrl, this.dietMenuNotFound);
						break;
					default:
						presentToast(this.toastCtrl, err.message);
						break;
				}
			}
		);
	}

	openEquivalentMeasurePage(dishPartFood: DishPartFood) {
		let modal = this.modalCtrl.create('EquivalentMeasurePage', {
			dishPartFood: dishPartFood
		});
		modal.onDidDismiss((weight: Weight) => {
			if (weight) {
			}
		});
		modal.present();
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
