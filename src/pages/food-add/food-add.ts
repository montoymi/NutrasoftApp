import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { IonicPage, NavController, NavParams, ViewController, ToastController, LoadingController } from 'ionic-angular';

import { FoodProvider } from '../../providers/providers';
import { FoodGroup } from '../../models/food-group';
import { Food } from '../../models/food';
import { DishPart } from '../../models/dish-part';
import { DishPartFood } from '../../models/dish-part-food';
import { presentToast, presentLoading } from '../../utils/utils';

@IonicPage()
@Component({
	selector: 'page-food-add',
	templateUrl: 'food-add.html'
})
export class FoodAddPage {
	form: FormGroup;
	foods: FormGroup;
	validationMessages;

	foodGroupList: FoodGroup[];
	foodGroup: FoodGroup;
	filteredFoodList: Food[];

	dishPartList: DishPart[];

	// Componente seleccionado.
	dishPart: DishPart;

	private requiredFoodGroupError: string;
	private requiredFoodError: string;
	private requiredPartError: string;

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
		this.translate.get(['REQUIRED_FOOD_GROUP_ERROR', 'REQUIRED_FOOD_ERROR', 'REQUIRED_PART_ERROR']).subscribe(values => {
			this.requiredFoodGroupError = values['REQUIRED_FOOD_GROUP_ERROR'];
			this.requiredFoodError = values['REQUIRED_FOOD_ERROR'];
			this.requiredPartError = values['REQUIRED_PART_ERROR'];
		});

		this.dishPartList = this.navParams.get('dishPartList');
		this.getAllFoods();

		this.validationMessages = {
			foodGroup: [{ type: 'required', message: this.requiredFoodGroupError }],
			foods: [{ type: 'invalid', message: this.requiredFoodError }],
			parts: [{ type: 'invalid', message: this.requiredPartError }]
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
			foods: this.foods,
			parts: ['', this.validateParts]
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

	validateParts(control: FormControl) {
		// Corrige bug que ocurre en el binding.
		control.markAsUntouched();

		let selected: boolean = false;

		if (control.value) {
			selected = true;
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
				let dishPartFood: DishPartFood = new DishPartFood();
				dishPartFood.food = food;
				this.dishPart.dishPartFoodList.push(dishPartFood);
			}
		}

		this.viewCtrl.dismiss();
	}
}
