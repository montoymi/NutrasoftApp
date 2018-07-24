import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

import { PlanDay } from '../../models/plan-day';
import { valueOfPct, round } from '../../utils/utils';
import { MACROS_RATIO_TYPE_CUSTOM, MACROS_RATIO_TYPE_DEFAULT } from '../../constants/constants';

@IonicPage()
@Component({
	selector: 'page-macronutrient-calc',
	templateUrl: 'macronutrient-calc.html'
})
export class MacronutrientCalcPage {
	form: FormGroup;
	macros: FormGroup;
	validationMessages;

	planDay: PlanDay;
	weight: number;
	isRatioCustom: boolean = false;
	total: number;

	private minFatEnergPctError: string;
	private invalidMacrosError: string;

	constructor(
		public navCtrl: NavController, 
		public navParams: NavParams, 
		public viewCtrl: ViewController, 
		public translate: TranslateService, 
		public formBuilder: FormBuilder
	) {
		this.translate.get(['MIN_FAT_ENERG_PCT_ERROR', 'INVALID_MACROS_ERROR']).subscribe(values => {
			this.minFatEnergPctError = values['MIN_FAT_ENERG_PCT_ERROR'];
			this.invalidMacrosError = values['INVALID_MACROS_ERROR'];
		});

		this.planDay = this.navParams.get('planDay');
		this.weight = this.navParams.get('weight');

		this.validationMessages = {
			fatEnergPct: [{ type: 'min', message: this.minFatEnergPctError }],
			macros: [{ type: 'invalid', message: this.invalidMacrosError }]
		};

		this.buildForm();
		this.setProBodywt(null);
	}

	buildForm() {
		this.macros = new FormGroup(
			{
				proEnergPct: new FormControl({ value: '', disabled: true }),
				choEnergPct: new FormControl({ value: '', disabled: true }),
				fatEnergPct: new FormControl({ value: '', disabled: true }, Validators.min(15))
			},
			(form: FormGroup) => {
				return this.validateMacros(form);
			}
		);

		this.form = this.formBuilder.group({
			isRatioCustom: [''],
			macros: this.macros
		});
	}

	validateMacros(form: FormGroup) {
		let total = 0;

		for (let key in form.controls) {
			if (form.controls.hasOwnProperty(key)) {
				let control: FormControl = <FormControl>form.controls[key];

				total += control.value;
			}
		}

		if (total != 100) {
			return { invalid: true };
		}

		return null;
	}

	enableRanges(toggle) {
		if (this.isRatioCustom) {
			Object.keys(this.macros.controls).forEach(key => {
				this.macros.get(key).enable();
			});
		} else {
			Object.keys(this.macros.controls).forEach(key => {
				this.macros.get(key).disable();
			});
		}
	}

	setProBodywt(range) {
		let proEnerg: number = valueOfPct(this.planDay.proEnergPct, this.planDay.energIntake);
		let pro: number = proEnerg / 4;
		this.planDay.proBodywt = round(pro / this.weight, 2);
	}

	cancel() {
		this.viewCtrl.dismiss();
	}

	done() {
		if (!this.form.valid) {
			return;
		}

		this.planDay.macrosRatioType = this.isRatioCustom ? MACROS_RATIO_TYPE_CUSTOM : MACROS_RATIO_TYPE_DEFAULT;

		this.viewCtrl.dismiss(this.planDay);
	}
}
