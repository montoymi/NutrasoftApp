import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { IonicPage, NavController, NavParams, ViewController, ToastController } from 'ionic-angular';

import { PlanProvider } from '../../providers/providers';
import { Activity } from '../../models/activity';
import { PlanDay } from '../../models/plan-day';
import { PlanDayActivity } from '../../models/plan-day-activity';
import { presentToast } from '../../utils/utils';

@IonicPage()
@Component({
	selector: 'page-activity-add',
	templateUrl: 'activity-add.html'
})
export class ActivityAddPage {
	form: FormGroup;
	days: FormGroup;
	validationMessages;

	activityClassList: Activity[];
	activityClass: Activity;
	activityType: Activity;

	planDayList: PlanDay[];

	selectedAll: boolean;

	// Actividad y tiempo seleccionado.
	activity: Activity;
	time: number;

	private requiredActivityClassError: string;
	private requiredActivityTypeError: string;
	private requiredActivityError: string;
	private requiredTimeError: string;
	private requiredDayError: string;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public viewCtrl: ViewController,
		public toastCtrl: ToastController,
		private translate: TranslateService,
		public formBuilder: FormBuilder,
		public planProvider: PlanProvider
	) {
		this.translate
			.get(['REQUIRED_ACTIVITY_CLASS_ERROR', 'REQUIRED_ACTIVITY_TYPE_ERROR', 'REQUIRED_ACTIVITY_ERROR', 'REQUIRED_TIME_ERROR', 'REQUIRED_DAY_ERROR'])
			.subscribe(values => {
				this.requiredActivityClassError = values['REQUIRED_ACTIVITY_CLASS_ERROR'];
				this.requiredActivityTypeError = values['REQUIRED_ACTIVITY_TYPE_ERROR'];
				this.requiredActivityError = values['REQUIRED_ACTIVITY_ERROR'];
				this.requiredTimeError = values['REQUIRED_TIME_ERROR'];
				this.requiredDayError = values['REQUIRED_DAY_ERROR'];
			});

		this.planDayList = this.navParams.get('planDayList');
		this.getAllActivities();

		this.validationMessages = {
			activityClass: [{ type: 'required', message: this.requiredActivityClassError }],
			activityType: [{ type: 'required', message: this.requiredActivityTypeError }],
			activity: [{ type: 'required', message: this.requiredActivityError }],
			time: [{ type: 'required', message: this.requiredTimeError }],
			days: [{ type: 'invalid', message: this.requiredDayError }]
		};
	}

	buildForm() {
		let dayControls = {};

		this.planDayList.forEach(planDay => (dayControls[planDay.day] = new FormControl()));

		this.days = new FormGroup(dayControls, (form: FormGroup) => {
			return this.validateDays(form);
		});

		this.form = this.formBuilder.group({
			activityClass: ['', Validators.required],
			activityType: ['', Validators.required],
			activity: ['', Validators.required],
			time: ['', Validators.required],
			days: this.days
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

	validateDays(form: FormGroup) {
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

	getAllActivities() {
		this.planProvider.getAllActivities(this.translate.getDefaultLang()).subscribe(
			(res: any) => {
				this.activityClassList = res.body;
				this.buildForm();
			},
			err => {
				presentToast(this.toastCtrl, err.message);
			}
		);
	}

	checkAll(checkbox) {
		this.selectedAll = checkbox.checked;
	}

	cancel() {
		this.viewCtrl.dismiss();
	}

	done() {
		if (!this.validateForm(this.form)) {
			return;
		}

		for (let planDay of this.planDayList) {
			if (planDay.checked) {
				let planDayActivity: PlanDayActivity = new PlanDayActivity();
				planDayActivity.activity = this.activity;
				planDayActivity.time = this.time;
				planDay.planDayActivityList.push(planDayActivity);
			}
		}

		this.viewCtrl.dismiss();
	}
}
