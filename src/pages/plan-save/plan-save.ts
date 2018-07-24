import { Component, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { IonicPage, NavController, NavParams, ViewController, ModalController, ToastController, LoadingController, Events } from 'ionic-angular';
import { IonicStepperComponent, IonicStepComponent } from 'ionic-stepper';
import { Observable } from 'rxjs/Rx';

import { UserProvider, PlanProvider } from '../../providers/providers';
import { Plan } from '../../models/plan';
import { PlanDay } from '../../models/plan-day';
import { PlanDayActivity } from '../../models/plan-day-activity';
import { User } from '../../models/user';
import { Item } from '../../models/item';
import { presentToast, presentLoading } from '../../utils/utils';
import { MACROS_RATIO_TYPE_DEFAULT } from '../../constants/constants';

@IonicPage()
@Component({
	selector: 'page-plan-save',
	templateUrl: 'plan-save.html'
})
export class PlanSavePage {
	@ViewChild('stepper') stepper: IonicStepperComponent;
	@ViewChild('clientInput') clientInput;

	form: FormGroup;
	step1: FormGroup;
	step2: FormGroup;
	step3: FormGroup;
	step4: FormGroup;
	validationMessages;

	plan: Plan;
	goalList: Item[];

	energVariationPctDesc: string;

	private dayNameList: string[] = new Array<string>();

	private step1Title: string;
	private step2Title: string;
	private step3Title: string;
	private step1Subtitle: string;
	private step2Subtitle: string;
	private step3Subtitle: string;
	private requiredClientError: string;
	private requiredGoalError: string;
	private requiredBeginDateError: string;
	private requiredEndDateError: string;
	private requiredHeightError: string;
	private requiredNeckError: string;
	private requiredWaistError: string;
	private requiredHipError: string;
	private requiredWeightError: string;
	private requiredHrMaxError: string;
	private invalidTotalHoursError: string;
	private validationError: string;
	private createPlanSuccess: string;
	private updatePlanSuccess: string;

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
		public planProvider: PlanProvider,
		public events: Events
	) {
		this.translate
			.get([
				'MONDAY',
				'TUESDAY',
				'WEDNESDAY',
				'THURSDAY',
				'FRIDAY',
				'SATURDAY',
				'SUNDAY',
				'STEP1_PLAN_TITLE',
				'STEP2_PLAN_TITLE',
				'STEP3_PLAN_TITLE',
				'STEP1_PLAN_SUBTITLE',
				'STEP2_PLAN_SUBTITLE',
				'STEP3_PLAN_SUBTITLE',
				'REQUIRED_CLIENT_ERROR',
				'REQUIRED_GOAL_ERROR',
				'REQUIRED_BEGIN_DATE_ERROR',
				'REQUIRED_END_DATE_ERROR',
				'REQUIRED_HEIGHT_ERROR',
				'REQUIRED_NECK_ERROR',
				'REQUIRED_WAIST_ERROR',
				'REQUIRED_HIP_ERROR',
				'REQUIRED_WEIGHT_ERROR',
				'REQUIRED_HRMAX_ERROR',
				'INVALID_TOTAL_HOURS_ERROR',
				'VALIDATION_ERROR',
				'CREATE_PLAN_SUCCESS',
				'UPDATE_PLAN_SUCCESS'
			])
			.subscribe(values => {
				this.dayNameList[0] = values['MONDAY'];
				this.dayNameList[1] = values['TUESDAY'];
				this.dayNameList[2] = values['WEDNESDAY'];
				this.dayNameList[3] = values['THURSDAY'];
				this.dayNameList[4] = values['FRIDAY'];
				this.dayNameList[5] = values['SATURDAY'];
				this.dayNameList[6] = values['SUNDAY'];
				this.step1Title = values['STEP1_PLAN_TITLE'];
				this.step2Title = values['STEP2_PLAN_TITLE'];
				this.step3Title = values['STEP3_PLAN_TITLE'];
				this.step1Subtitle = values['STEP1_PLAN_SUBTITLE'];
				this.step2Subtitle = values['STEP2_PLAN_SUBTITLE'];
				this.step3Subtitle = values['STEP3_PLAN_SUBTITLE'];
				this.requiredClientError = values['REQUIRED_CLIENT_ERROR'];
				this.requiredGoalError = values['REQUIRED_GOAL_ERROR'];
				this.requiredBeginDateError = values['REQUIRED_BEGIN_DATE_ERROR'];
				this.requiredEndDateError = values['REQUIRED_END_DATE_ERROR'];
				this.requiredHeightError = values['REQUIRED_HEIGHT_ERROR'];
				this.requiredNeckError = values['REQUIRED_NECK_ERROR'];
				this.requiredWaistError = values['REQUIRED_WAIST_ERROR'];
				this.requiredHipError = values['REQUIRED_HIP_ERROR'];
				this.requiredWeightError = values['REQUIRED_WEIGHT_ERROR'];
				this.requiredHrMaxError = values['REQUIRED_HRMAX_ERROR'];
				this.invalidTotalHoursError = values['INVALID_TOTAL_HOURS_ERROR'];
				this.validationError = values['VALIDATION_ERROR'];
				this.createPlanSuccess = values['CREATE_PLAN_SUCCESS'];
				this.updatePlanSuccess = values['UPDATE_PLAN_SUCCESS'];
			});

		this.validationMessages = {
			client: [{ type: 'required', message: this.requiredClientError }],
			goal: [{ type: 'required', message: this.requiredGoalError }],
			beginDate: [{ type: 'required', message: this.requiredBeginDateError }],
			endDate: [{ type: 'required', message: this.requiredEndDateError }],
			height: [{ type: 'required', message: this.requiredHeightError }],
			neck: [{ type: 'required', message: this.requiredNeckError }],
			waist: [{ type: 'required', message: this.requiredWaistError }],
			hip: [{ type: 'required', message: this.requiredHipError }],
			weight: [{ type: 'required', message: this.requiredWeightError }],
			hrMax: [{ type: 'required', message: this.requiredHrMaxError }]
		};
	}

	buildForm() {
		this.step1 = new FormGroup({
			client: new FormControl(this.plan.client.name, Validators.required),
			goal: new FormControl(this.plan.goal.id, Validators.required),
			beginDate: new FormControl(this.plan.beginDate, Validators.required),
			endDate: new FormControl(this.plan.endDate, Validators.required)
		});

		this.step2 = new FormGroup({
			height: new FormControl(this.plan.height, Validators.required),
			neck: new FormControl(this.plan.neck, Validators.required),
			waist: new FormControl(this.plan.waist, Validators.required),
			hip: new FormControl(this.plan.hip, Validators.required),
			weight: new FormControl(this.plan.weight, Validators.required),
			hrMax: new FormControl(this.plan.hrMax, Validators.required)
		});

		this.step3 = new FormGroup({});

		this.step4 = new FormGroup({
			energVariationPct: new FormControl(this.plan.energVariationPct)
		});

		this.form = this.formBuilder.group({
			step1: this.step1,
			step2: this.step2,
			step3: this.step3,
			step4: this.step4
		});

		/*
		 * Listeners para limpiar los mensajes de error.
		 */

		this.form.get('step1').valueChanges.subscribe(val => {
			if (this.step1.valid) {
				this.setError(this.getStep(this.step1Title), null, this.step1Subtitle);
			}
		});

		this.form.get('step2').valueChanges.subscribe(val => {
			if (this.step2.valid) {
				this.setError(this.getStep(this.step2Title), null, this.step2Subtitle);
			}
		});
	}

	prepareCalculate() {
		const formModel = this.form.value;

		// Step 1.
		this.plan.goal.id = formModel.step1.goal;
		this.plan.beginDate = formModel.step1.beginDate;
		this.plan.endDate = formModel.step1.endDate;

		// Step 2.
		this.plan.height = formModel.step2.height;
		this.plan.neck = formModel.step2.neck;
		this.plan.waist = formModel.step2.waist;
		this.plan.hip = formModel.step2.hip;
		this.plan.weight = formModel.step2.weight;
		this.plan.hrMax = formModel.step2.hrMax;

		// Step 4.
		this.plan.energVariationPct = formModel.step4.energVariationPct;
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

	validateForm3(): string {
		for (let planDay of this.plan.planDayList) {
			if (planDay.totalHours != 24) {
				return this.invalidTotalHoursError.replace('{day}', planDay.dayName);
			}
		}

		return null;
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
		if (this.navParams.get('planId')) {
			this.getPlanByIdAndReferenceData();
		} else {
			this.getReferenceData();

			this.plan = new Plan();
			this.plan.client = new User();
			this.plan.goal = new Item(null);
			this.plan.energVariationPct = 0;

			// Inicio: Crea la lista de planDay.
			this.plan.planDayList = new Array<PlanDay>();

			for (let i = 0; i < 7; i++) {
				let planDay = new PlanDay();
				planDay.day = i + 1;
				planDay.dayName = this.dayNameList[i];
				planDay.macrosRatioType = MACROS_RATIO_TYPE_DEFAULT;
				planDay.showDetails = true;
				planDay.icon = 'ios-arrow-up';
				planDay.planDayActivityList = new Array<PlanDayActivity>();
				this.plan.planDayList.push(planDay);
			}
			// Fin: Crea la lista de planDay.

			this.setEnergVariationPctDesc(this.plan.energVariationPct);
			this.buildForm();
		}
	}

	getPlanByIdAndReferenceData() {
		let lang: string = this.translate.getDefaultLang();
		let planId = this.navParams.get('planId');

		let loading = presentLoading(this.loadingCtrl);
		Observable.combineLatest(this.planProvider.getAllGoals(lang), this.planProvider.getPlanById(planId, lang)).subscribe(
			(res: any[]): void => {
				loading.dismiss();
				this.goalList = res[0].body;
				this.plan = res[1].body;

				// Asigna los nombres de los días y propiedades del grupo.
				for (let planDay of this.plan.planDayList) {
					planDay.dayName = this.dayNameList[planDay.day - 1];
					planDay.showDetails = true;
					planDay.icon = 'ios-arrow-up';
				}

				this.setEnergVariationPctDesc(this.plan.energVariationPct);
				this.setTotalHours();

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
		this.planProvider.getAllGoals(lang).subscribe(
			(res: any) => {
				loading.dismiss();
				this.goalList = res.body;
			},
			err => {
				loading.dismiss();
				presentToast(this.toastCtrl, err.message);
			}
		);
	}

	/*
	 * Stepper.
	 */

	// Este evento se ejecuta cuando se cambia de step. Por eso, para los errores de validación
	// se llama al método previousStep el cual regresa al step anterior.
	selectChange(e) {
		switch (e) {
			// General.
			case 0:
				break;
			// Medidas.
			case 1:
				if (!this.validateForm(this.step1)) {
					this.setError(this.getStep(this.step1Title), this.validationError, null);
					this.stepper.previousStep();
					return;
				}

				break;
			// Aactividades diarias.
			case 2:
				if (!this.validateForm(this.step2)) {
					this.setError(this.getStep(this.step2Title), this.validationError, null);
					this.stepper.previousStep();
					return;
				}

				break;
			// Ingesta diaria.
			case 3:
				let message = this.validateForm3();
				if (message) {
					this.setError(this.getStep(this.step3Title), message, null);
					this.stepper.previousStep();
					return;
				}

				this.calculatePlan();

				break;
		}
	}

	getStep(title: string): IonicStepComponent {
		return this.stepper._steps.find(step => step.label === title);
	}

	setError(step: IonicStepComponent, error: string, subtitle: string) {
		if (error != null) {
			step.status = 'error';
			step.description = error;
		} else {
			step.status = '';
			step.description = subtitle;
			// Actualiza la UI.
			this.stepper.setStep(this.stepper.selectedIndex);
		}
	}

	/*
	 * Step 1.
	 */

	openUserSearchPage() {
		let modal = this.modalCtrl.create('UserSearchPage', {
			userType: 'CLIENT'
		});
		modal.onDidDismiss((client: User) => {
			if (client) {
				this.plan.client = client;
				this.form.get('step1').patchValue({ client: client.name });
				this.clientInput.setFocus();
			}
		});
		modal.present();
	}

	/*
	 * Step 3.
	 */

	openActivityAddPage() {
		let modal = this.modalCtrl.create('ActivityAddPage', {
			planDayList: this.plan.planDayList
		});
		modal.onDidDismiss(() => {
			this.setTotalHours();
			this.setError(this.getStep(this.step3Title), null, this.step3Subtitle);
		});
		modal.present();
	}

	removePlanDayActivity(planDay: PlanDay, planDayActivity: PlanDayActivity) {
		let planDayActivityList: PlanDayActivity[] = planDay.planDayActivityList;
		let index: number = planDayActivityList.indexOf(planDayActivity);

		if (index !== -1) {
			planDayActivityList.splice(index, 1);
		}

		this.setTotalHours();
	}

	setTotalHours() {
		for (let planDay of this.plan.planDayList) {
			planDay.totalHours = 0;

			for (let planDayActivity of planDay.planDayActivityList) {
				planDay.totalHours += +planDayActivity.time;
			}
		}
	}

	calculatePlan() {
		this.prepareCalculate();

		let loading = presentLoading(this.loadingCtrl);
		this.planProvider.calculatePlan(this.plan).subscribe(
			(res: any) => {
				loading.dismiss();
				this.plan = res.body;
			},
			err => {
				loading.dismiss();
				presentToast(this.toastCtrl, err.message);
			}
		);
	}

	/*
	 * Step 4.
	 */

	doEnergVariation(range) {
		this.setEnergVariationPctDesc(range.value);
		this.calculatePlan();
	}

	setEnergVariationPctDesc(value) {
		switch (true) {
			case value < 0:
				this.energVariationPctDesc = 'La ingesta energética es menor que el gasto energético en un ' + value + '%';
				break;
			case value == 0:
				this.energVariationPctDesc = 'La ingesta energética es igual que el gasto energético';
				break;
			case value > 0:
				this.energVariationPctDesc = 'La ingesta energética es mayor que el gasto energético en un ' + value + '%';
				break;
		}
	}

	openMacronutrientCalcPage(planDay: PlanDay) {
		let modal = this.modalCtrl.create('MacronutrientCalcPage', {
			planDay: planDay,
			weight: this.plan.weight
		});
		modal.onDidDismiss(() => {
			this.calculatePlan();
		});
		modal.present();
	}

	createPlan() {
		let loading = presentLoading(this.loadingCtrl);
		this.planProvider.createPlan(this.plan).subscribe(
			(res: any) => {
				loading.dismiss();
				presentToast(this.toastCtrl, this.createPlanSuccess);
				this.plan = res.body;
				this.events.publish('plan:save');
				this.viewCtrl.dismiss();
			},
			err => {
				loading.dismiss();
				presentToast(this.toastCtrl, err.message);
			}
		);
	}

	updatePlan() {
		let loading = presentLoading(this.loadingCtrl);
		this.planProvider.updatePlan(this.plan).subscribe(
			(res: any) => {
				loading.dismiss();
				presentToast(this.toastCtrl, this.updatePlanSuccess);
				this.plan = res.body;
				this.events.publish('plan:save');
				this.viewCtrl.dismiss();
			},
			err => {
				loading.dismiss();
				presentToast(this.toastCtrl, err.message);
			}
		);
	}

	done() {
		if (!this.plan.id) {
			this.createPlan();
		} else {
			this.updatePlan();
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
