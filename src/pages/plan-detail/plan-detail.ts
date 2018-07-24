import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, Events } from 'ionic-angular';
import { Plan } from '../../models/plan';

import { UserProvider, PlanProvider } from '../../providers/providers';
import { presentToast, presentLoading } from '../../utils/utils';

@IonicPage()
@Component({
	selector: 'page-plan-detail',
	templateUrl: 'plan-detail.html'
})
export class PlanDetailPage {
	plan: Plan;

	segment: string;

	private dayNameList: string[] = new Array<string>();

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public toastCtrl: ToastController,
		public loadingCtrl: LoadingController,
		public translate: TranslateService,
		public userProvider: UserProvider,
		public planProvider: PlanProvider,
		public events: Events
	) {
		this.translate.get(['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']).subscribe(values => {
			this.dayNameList[0] = values['MONDAY'];
			this.dayNameList[1] = values['TUESDAY'];
			this.dayNameList[2] = values['WEDNESDAY'];
			this.dayNameList[3] = values['THURSDAY'];
			this.dayNameList[4] = values['FRIDAY'];
			this.dayNameList[5] = values['SATURDAY'];
			this.dayNameList[6] = values['SUNDAY'];
		});

		events.subscribe('plan:save', () => {
			this.getPlanById();
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
		this.getPlanById();
	}

	getPlanById() {
		let planId = this.navParams.get('planId');
		let lang: string = this.translate.getDefaultLang();

		let loading = presentLoading(this.loadingCtrl);
		this.planProvider.getPlanById(planId, lang).subscribe(
			(res: any) => {
				loading.dismiss();
				this.plan = res.body;

				// Asigna los nombres de los días y propiedades del grupo.
				for (let planDay of this.plan.planDayList) {
					planDay.dayName = this.dayNameList[planDay.day - 1];
					planDay.showDetails = true;
					planDay.icon = 'ios-arrow-up';
				}

				this.segment = 'tab1';
			},
			err => {
				loading.dismiss();
				presentToast(this.toastCtrl, err.message);
			}
		);
	}

	openPlanSavePage() {
		this.navCtrl.push('PlanSavePage', { planId: this.plan.id });
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
