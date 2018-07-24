import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { IonicPage, NavController, NavParams, ViewController, ModalController, ToastController, LoadingController, Events } from 'ionic-angular';

import { UserProvider, DishProvider } from '../../providers/providers';
import { Dish } from '../../models/dish';
import { DishPart } from '../../models/dish-part';
import { DishPartFood } from '../../models/dish-part-food';
import { presentToast, presentLoading } from '../../utils/utils';

@IonicPage()
@Component({
	selector: 'page-dish-save',
	templateUrl: 'dish-save.html'
})
export class DishSavePage {
	form: FormGroup;
	validationMessages;

	dish: Dish;

	private partNameList: string[] = new Array<string>();
	private partCodeList: string[] = new Array<string>();

	private requiredDishNameError: string;
	private requiredFoodsError: string;
	private createDishSuccess: string;
	private updateDishSuccess: string;

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
		public dishProvider: DishProvider,
		public events: Events
	) {
		this.translate
			.get(['PART_PRO', 'PART_GAR', 'PART_SAU', 'REQUIRED_DISH_NAME_ERROR', 'REQUIRED_FOODS_ERROR', 'CREATE_DISH_SUCCESS', 'UPDATE_DISH_SUCCESS'])
			.subscribe(values => {
				this.partNameList[0] = values['PART_PRO'];
				this.partNameList[1] = values['PART_GAR'];
				this.partNameList[2] = values['PART_SAU'];
				this.requiredDishNameError = values['REQUIRED_DISH_NAME_ERROR'];
				this.requiredFoodsError = values['REQUIRED_FOODS_ERROR'];
				this.createDishSuccess = values['CREATE_DISH_SUCCESS'];
				this.updateDishSuccess = values['UPDATE_DISH_SUCCESS'];
			});

		this.validationMessages = {
			name: [{ type: 'required', message: this.requiredDishNameError }],
			hasFoods: [{ type: 'pattern', message: this.requiredFoodsError }]
		};
	}

	buildForm() {
		this.form = this.formBuilder.group({
			name: [this.dish.name, Validators.required],
			hasFoods: [false, Validators.pattern('true')]
		});
	}

	prepareSave() {
		const formModel = this.form.value;

		this.dish.name = formModel.name;
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

	validateFoods() {
		let hasFoods: boolean = false;

		for (let dishPart of this.dish.dishPartList) {
			for (let dishPartFood of dishPart.dishPartFoodList) {
				if (dishPartFood.food) {
					hasFoods = true;
				}
			}
		}

		this.form.patchValue({ hasFoods: hasFoods });
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
		if (this.navParams.get('dishId')) {
			this.getDishById();
		} else {
			this.dish = new Dish();
			this.dish.coach = this.userProvider.user;

			this.partCodeList[0] = 'P';
			this.partCodeList[1] = 'G';
			this.partCodeList[2] = 'S';

			// Inicio: Crea la lista de dishPartFood.
			this.dish.dishPartList = new Array<DishPart>();

			for (let i = 0; i < 3; i++) {
				let dishPart = new DishPart();
				dishPart.partCode = this.partCodeList[i];
				dishPart.partName = this.partNameList[i];
				dishPart.showDetails = true;
				dishPart.icon = 'ios-arrow-up';
				dishPart.dishPartFoodList = new Array<DishPartFood>();
				this.dish.dishPartList.push(dishPart);
			}
			// Fin: Crea la lista de dishPartFood.

			this.buildForm();
		}
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

				this.buildForm();
				this.validateFoods();
			},
			err => {
				loading.dismiss();
				presentToast(this.toastCtrl, err.message);
			}
		);
	}

	openFoodAddPage() {
		let modal = this.modalCtrl.create('FoodAddPage', {
			dishPartList: this.dish.dishPartList
		});
		modal.onDidDismiss(() => {
			this.validateFoods();
		});
		modal.present();
	}

	removeDishPartFood(dishPart: DishPart, dishPartFood: DishPartFood) {
		let dishPartFoodList: DishPartFood[] = dishPart.dishPartFoodList;
		let index: number = dishPartFoodList.indexOf(dishPartFood);

		if (index !== -1) {
			dishPartFoodList.splice(index, 1);
			this.validateFoods();
		}
	}

	createDish() {
		this.prepareSave();

		let loading = presentLoading(this.loadingCtrl);
		this.dishProvider.createDish(this.dish).subscribe(
			(res: any) => {
				loading.dismiss();
				presentToast(this.toastCtrl, this.createDishSuccess);
				this.dish = res.body;
				this.events.publish('dish:save');
				this.viewCtrl.dismiss();
			},
			err => {
				loading.dismiss();
				presentToast(this.toastCtrl, err.message);
			}
		);
	}

	updateDish() {
		this.prepareSave();

		let loading = presentLoading(this.loadingCtrl);
		this.dishProvider.updateDish(this.dish).subscribe(
			(res: any) => {
				loading.dismiss();
				presentToast(this.toastCtrl, this.updateDishSuccess);
				this.dish = res.body;
				this.events.publish('dish:save');
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

		if (!this.dish.id) {
			this.createDish();
		} else {
			this.updateDish();
		}
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
