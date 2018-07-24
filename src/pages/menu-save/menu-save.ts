import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Validators, FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { IonicPage, NavController, NavParams, ViewController, ModalController, ToastController, LoadingController, Events } from 'ionic-angular';
import { Observable } from 'rxjs/Rx';

import { UserProvider, DietProvider, MenuProvider } from '../../providers/providers';
import { Menu } from '../../models/menu';
import { Meal } from '../../models/meal';
import { MenuMeal } from '../../models/menu-meal';
import { DietType } from '../../models/diet-type';
import { Dish } from '../../models/dish';
import { presentToast, presentLoading, buildMenuName } from '../../utils/utils';

@IonicPage()
@Component({
	selector: 'page-menu-save',
	templateUrl: 'menu-save.html'
})
export class MenuSavePage {
	form: FormGroup;
	validationMessages;

	menu: Menu;
	dietTypeList: DietType;
	mealList: Meal[];

	private weekText: string;
	private dayNameList: string[] = new Array<string>();

	private requiredDietTypeError: string;
	private requiredDishError: string;
	private createMenuSuccess: string;
	private updateMenuSuccess: string;

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
		public dietProvider: DietProvider,
		public menuProvider: MenuProvider,
		public events: Events
	) {
		this.translate.get(['REQUIRED_DIET_TYPE_ERROR', 'REQUIRED_DISH_ERROR', 'CREATE_MENU_SUCCESS', 'UPDATE_MENU_SUCCESS']).subscribe(values => {
			this.requiredDietTypeError = values['REQUIRED_DIET_TYPE_ERROR'];
			this.requiredDishError = values['REQUIRED_DISH_ERROR'];
			this.createMenuSuccess = values['CREATE_MENU_SUCCESS'];
			this.updateMenuSuccess = values['UPDATE_MENU_SUCCESS'];
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

		this.validationMessages = {
			dietType: [{ type: 'required', message: this.requiredDietTypeError }],
			dish: [{ type: 'required', message: this.requiredDishError }]
		};
	}

	buildForm() {
		let formArray = new Array<FormGroup>();

		for (let meal of this.menu.menuMealList) {
			let form: FormGroup = this.formBuilder.group({
				dish: [meal.dish.name, Validators.required]
			});

			formArray.push(form);
		}

		this.form = this.formBuilder.group({
			dietType: [this.menu.dietType.id, Validators.required],
			formArray: this.formBuilder.array(formArray)
		});
	}

	get formArray(): FormArray {
		return this.form.get('formArray') as FormArray;
	}

	prepareSave() {
		// Este método no es necesario ya que todos los valores se asignan
		// en los eventos asociados a los controles.
	}

	validateForm(form: FormGroup): boolean {
		if (!form.valid) {
			// Marca los controles como modificados para mostrar los mensajes de error.
			Object.keys(form.controls).forEach(key => {
				form.get(key).markAsDirty();
			});

			// Existe un formulario por cada meal, donde cada uno tiene un control (key = dish)
			Array.from(this.formArray.controls).forEach((form: FormGroup) => {
				Object.keys(form.controls).forEach(key => {
					form.get(key).markAsDirty();
				});
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

	// Runs when the page has loaded. This event is NOT fired on
	// entering a view that is already cached.
	ionViewDidLoad() {
		if (this.navParams.get('menuId')) {
			this.getMenuByIdAndReferenceData();
		} else {
			this.getReferenceData();
		}
	}

	getMenuByIdAndReferenceData() {
		let lang: string = this.translate.getDefaultLang();
		let menuId = this.navParams.get('menuId');

		let loading = presentLoading(this.loadingCtrl);
		Observable.combineLatest(this.dietProvider.getAllDietTypes(lang), this.menuProvider.getAllMeals(lang), this.menuProvider.getMenuById(menuId, lang)).subscribe(
			(res: any[]): void => {
				loading.dismiss();
				this.dietTypeList = res[0].body;
				this.mealList = res[1].body;
				this.menu = res[2].body;

				buildMenuName(this.menu, this.weekText, this.dayNameList);

				this.buildForm();
			},
			err => {
				loading.dismiss();
				presentToast(this.toastCtrl, err.message);
			}
		);
	}

	getReferenceData() {
		let lang: string = this.translate.getDefaultLang();

		let loading = presentLoading(this.loadingCtrl);
		Observable.combineLatest(this.dietProvider.getAllDietTypes(lang), this.menuProvider.getAllMeals(lang)).subscribe(
			(res: any[]): void => {
				loading.dismiss();
				this.dietTypeList = res[0].body;
				this.mealList = res[1].body;

				this.menu = new Menu();
				this.menu.dietType = new DietType();

				// Inicio: Crea la lista de menuMeal.
				this.menu.menuMealList = new Array<MenuMeal>();

				for (let meal of this.mealList) {
					let menuMeal = new MenuMeal();
					menuMeal.meal = meal;
					menuMeal.dish = new Dish();
					this.menu.menuMealList.push(menuMeal);
				}
				// Fin: Crea la lista de menuMeal.

				this.buildForm();
			},
			err => {
				loading.dismiss();
				presentToast(this.toastCtrl, err.message);
			}
		);
	}

	getNextMenu(dietTypeId) {
		let coachId: number = this.userProvider.user.id;

		let loading = presentLoading(this.loadingCtrl);
		this.menuProvider.getNextMenu(coachId, dietTypeId).subscribe(
			(res: any) => {
				loading.dismiss();
				let menu: Menu = res.body;
				this.menu.coach = menu.coach;
				this.menu.dietType = menu.dietType;
				this.menu.week = menu.week;
				this.menu.day = menu.day;

				buildMenuName(this.menu, this.weekText, this.dayNameList);
			},
			err => {
				loading.dismiss();
				presentToast(this.toastCtrl, err.message);
			}
		);
	}

	openDishSearchPage(index: number) {
		let modal = this.modalCtrl.create('DishSearchPage');
		modal.onDidDismiss((dish: Dish) => {
			if (dish) {
				this.menu.menuMealList[index].dish = dish;
				this.formArray.controls[index].patchValue({ dish: dish.name });
			}
		});
		modal.present();
	}

	createMenu() {
		this.prepareSave();

		let loading = presentLoading(this.loadingCtrl);
		this.menuProvider.createMenu(this.menu).subscribe(
			(res: any) => {
				loading.dismiss();
				presentToast(this.toastCtrl, this.createMenuSuccess);
				this.menu = res.body;
				this.events.publish('menu:save');
				this.viewCtrl.dismiss();
			},
			err => {
				loading.dismiss();
				presentToast(this.toastCtrl, err.message);
			}
		);
	}

	updateMenu() {
		this.prepareSave();

		let loading = presentLoading(this.loadingCtrl);
		this.menuProvider.updateMenu(this.menu).subscribe(
			(res: any) => {
				loading.dismiss();
				presentToast(this.toastCtrl, this.updateMenuSuccess);
				this.menu = res.body;
				this.events.publish('menu:save');
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

		if (!this.menu.id) {
			this.createMenu();
		} else {
			this.updateMenu();
		}
	}
}
