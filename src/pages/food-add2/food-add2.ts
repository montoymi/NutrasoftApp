import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { IonicPage, NavController, NavParams, ViewController, ToastController, LoadingController } from 'ionic-angular';

import { FoodProvider } from '../../providers/providers';
import { FoodGroup } from '../../models/food-group';
import { Food } from '../../models/food';
import { ExcludedFood } from '../../models/excluded-food';
import { presentToast, presentLoading } from '../../utils/utils';

@IonicPage()
@Component({
	selector: 'page-food-add2',
	templateUrl: 'food-add2.html'
})
export class FoodAdd2Page {
	form: FormGroup;
	foods: FormGroup;
	validationMessages;

	foodGroupList: FoodGroup[];
	foodGroup: FoodGroup;
	filteredFoodList: Food[];

	excludedFoodList: ExcludedFood[];

	// Alimento excluido seleccionado.
	excludedFood: ExcludedFood;

	private requiredFoodGroupError: string;
	private requiredFoodError: string;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public viewCtrl: ViewController,
		public toastCtrl: ToastController,
		public loadingCtrl: LoadingController,
		private translate: TranslateService,
		public formBuilder: FormBuilder,
		public foodProvider: FoodProvider
	) {
		this.translate.get(['REQUIRED_FOOD_GROUP_ERROR', 'REQUIRED_FOOD_ERROR']).subscribe(values => {
			this.requiredFoodGroupError = values['REQUIRED_FOOD_GROUP_ERROR'];
			this.requiredFoodError = values['REQUIRED_FOOD_ERROR'];
		});

		this.excludedFoodList = this.navParams.get('excludedFoodList');
		this.getAllFoods();

		this.validationMessages = {
			foodGroup: [{ type: 'required', message: this.requiredFoodGroupError }],
			foods: [{ type: 'invalid', message: this.requiredFoodError }]
		};
	}

	buildForm() {
		let foodControls = {};

		for (let foodGroup of this.foodGroupList) {
			foodGroup.foodList.forEach(food => (foodControls[food.ndbNo] = new FormControl()));
		}

		this.foods = new FormGroup(foodControls, (form: FormGroup) => {
			return this.validateFoods(form);
		});

		this.form = this.formBuilder.group({
			foodGroup: ['', Validators.required],
			foods: this.foods
		});
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

	validateFoods(form: FormGroup) {
		let selected: boolean = false;

		for (let key in form.controls) {
			if (form.controls.hasOwnProperty(key)) {
				let control: FormControl = <FormControl>form.controls[key];

				if (control.value) {
					selected = true;
					break;
				}
			}
		}

		if (!selected) {
			return { invalid: true };
		}

		return null;
	}

	getAllFoods() {
		let loading = presentLoading(this.loadingCtrl);
		this.foodProvider.getAllFoods(this.translate.getDefaultLang()).subscribe(
			(res: any) => {
				loading.dismiss();
				this.foodGroupList = res.body;
				this.buildForm();
			},
			err => {
				loading.dismiss();
				presentToast(this.toastCtrl, err.message);
			}
		);
	}

	initializeItems() {
		this.filteredFoodList = this.foodGroup.foodList;
	}

	getItems(ev) {
		// Reset items back to all of the items
		this.initializeItems();

		// set val to the value of the ev target
		let val: string = ev.target.value;

		// if the value is an empty string don't filter the items
		if (val && val.trim() != '') {
			this.filteredFoodList = this.filteredFoodList.filter(food => {
				return food.name.toLowerCase().indexOf(val.toLowerCase()) > -1;
			});
		}
	}

	cancel() {
		this.viewCtrl.dismiss();
	}

	done() {
		if (!this.validateForm(this.form)) {
			return;
		}

		for (let food of this.filteredFoodList) {
			if (food.checked) {
				let excludedFood: ExcludedFood = new ExcludedFood();
				excludedFood.food = food;
				this.excludedFoodList.push(excludedFood);
			}
		}

		this.viewCtrl.dismiss();
	}
}
