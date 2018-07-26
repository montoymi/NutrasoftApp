import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { IonicPage, NavController, NavParams, ViewController, ToastController, LoadingController } from 'ionic-angular';

import { DishProvider } from '../../providers/providers';
import { NutrientRatio } from '../../models/nutrient-ratio';
import { PlanDay } from '../../models/plan-day';
import { Dish } from '../../models/dish';
import { ValidateDishParam } from '../../models/validate-dish-param';
import { presentLoading, presentToast } from '../../utils/utils';

@IonicPage()
@Component({
	selector: 'page-dish-validator',
	templateUrl: 'dish-validator.html'
})
export class DishValidatorPage {
	form: FormGroup;
	passwords: FormGroup;
	validationMessages;

	nutrientRatioList: NutrientRatio[];
	nutrientRatio: NutrientRatio;
	validateDishParam: ValidateDishParam;

	private requiredEnergIntakeError: string;
	private requiredNutrientRatioError: string;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public viewCtrl: ViewController,
		public toastCtrl: ToastController,
		public loadingCtrl: LoadingController,
		public translate: TranslateService,
		public formBuilder: FormBuilder,
		public dishProvider: DishProvider
	) {
		this.translate.get(['REQUIRED_ENERG_INTAKE_ERROR', 'REQUIRED_NUTRIENT_RATIO_ERROR']).subscribe(values => {
			this.requiredEnergIntakeError = values['REQUIRED_ENERG_INTAKE_ERROR'];
			this.requiredNutrientRatioError = values['REQUIRED_NUTRIENT_RATIO_ERROR'];
		});

		this.buildForm();

		this.validationMessages = {
			energIntake: [{ type: 'required', message: this.requiredEnergIntakeError }],
			nutrientRatio: [{ type: 'required', message: this.requiredNutrientRatioError }]
		};

		this.getNutrientRatioList();
	}

	buildForm() {
		this.form = this.formBuilder.group({
			energIntake: ['', Validators.required],
			nutrientRatio: ['', Validators.required]
		});
	}

	prepareValidate() {
		const formModel = this.form.value;

		let planDay: PlanDay;
		planDay.energIntake = formModel.energIntake;
		planDay.proEnergPct = this.nutrientRatio.proEnergPct;
		planDay.choEnergPct = this.nutrientRatio.choEnergPct;
		planDay.fatEnergPct = this.nutrientRatio.fatEnergPct;
		this.validateDishParam.planDay = planDay;

		let dish: Dish = this.navParams.get('dish');
		this.validateDishParam.dish = dish;
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

	getNutrientRatioList() {
		let loading = presentLoading(this.loadingCtrl);
		this.dishProvider.getAllNutrientRatios().subscribe(
			(res: any) => {
				loading.dismiss();
				this.nutrientRatioList = res.body;

				for (let nutrientRatio of this.nutrientRatioList) {
					//TODO: lang
					nutrientRatio.name = nutrientRatio.proEnergPct + '/' + nutrientRatio.choEnergPct + '/' + nutrientRatio.fatEnergPct;
				}
			},
			err => {
				loading.dismiss();
				presentToast(this.toastCtrl, err.message);
			}
		);
	}

	validateDish() {
		this.prepareValidate();

		let loading = presentLoading(this.loadingCtrl);
		this.dishProvider.validateDish(this.validateDishParam).subscribe(
			(res: any) => {
				loading.dismiss();
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
		if (!this.validateForm(this.form)) {
			return;
		}

		this.validateDish();
	}
}
