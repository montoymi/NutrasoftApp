import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, NavParams, PopoverController, ToastController, LoadingController, AlertController, Refresher, Events } from 'ionic-angular';

import { UserProvider, PlanProvider } from '../../providers/providers';
import { User } from '../../models/user';
import { Plan } from '../../models/plan';
import { presentToast, presentLoading } from '../../utils/utils';

@IonicPage()
@Component({
	selector: 'page-plan-list',
	templateUrl: 'plan-list.html'
})
export class PlanListPage {
	clientList: User[];
	filteredClientList: User[];

	private confirmTitle: string;
	private confirmMessage: string;
	private cancelButton: string;
	private okButton: string;
	private deletePlanSuccess: string;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public popoverCtrl: PopoverController,
		public toastCtrl: ToastController,
		public loadingCtrl: LoadingController,
		private alertCtrl: AlertController,
		public translate: TranslateService,
		public userProvider: UserProvider,
		public planProvider: PlanProvider,
		public events: Events
	) {
		this.translate.get(['DELETE_PLAN_CONFIRM_TITLE', 'DELETE_PLAN_CONFIRM_MESSAGE', 'CANCEL_BUTTON', 'OK_BUTTON', 'DELETE_PLAN_SUCCESS']).subscribe(values => {
			this.confirmTitle = values['DELETE_PLAN_CONFIRM_TITLE'];
			this.confirmMessage = values['DELETE_PLAN_CONFIRM_MESSAGE'];
			this.cancelButton = values['CANCEL_BUTTON'];
			this.okButton = values['OK_BUTTON'];
			this.deletePlanSuccess = values['DELETE_PLAN_SUCCESS'];
		});

		events.subscribe('plan:save', () => {
			this.getClientsByCoachId(null);
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
		this.getClientsByCoachId(null);
	}

	presentPopover(event: Event) {
		let popover = this.popoverCtrl.create('PopoverPage');
		popover.present({ ev: event });
	}

	getClientsByCoachId(refresher: Refresher) {
		let coachId: number = this.userProvider.user.id;
		let lang: string = this.translate.getDefaultLang();

		this.planProvider.getClientsByCoachId(coachId, lang).subscribe(
			(res: any) => {
				if (refresher) refresher.complete();
				this.clientList = res.body;
				this.initializeItems();

				// Inicializa propiedades del grupo.
				for (let client of this.clientList) {
					client.showDetails = true;
					client.icon = 'ios-arrow-up';
				}
			},
			err => {
				if (refresher) refresher.complete();
				presentToast(this.toastCtrl, err.message);
			}
		);
	}

	initializeItems() {
		this.filteredClientList = this.clientList;
	}

	getItems(ev) {
		// Reset items back to all of the items
		this.initializeItems();

		// set val to the value of the ev target
		let val: string = ev.target.value;

		// if the value is an empty string don't filter the items
		if (val && val.trim() != '') {
			this.filteredClientList = this.filteredClientList.filter(client => {
				return client.name.toLowerCase().indexOf(val.toLowerCase()) > -1;
			});
		}
	}

	openPlanSavePage() {
		this.navCtrl.push('PlanSavePage');
	}

	openPlanDetailPage(plan: Plan) {
		this.navCtrl.push('PlanDetailPage', { planId: plan.id });
	}

	deletePlan(plan: Plan) {
		let alert = this.alertCtrl.create({
			title: this.confirmTitle,
			message: this.confirmMessage,
			buttons: [
				{
					text: this.cancelButton,
					role: 'cancel',
					handler: data => {
						console.log('Cancel clicked');
					}
				},
				{
					text: this.okButton,
					handler: data => {
						let loading = presentLoading(this.loadingCtrl);
						this.planProvider.deletePlan(plan.id).subscribe(
							(res: any) => {
								loading.dismiss();
								presentToast(this.toastCtrl, this.deletePlanSuccess);
								this.getClientsByCoachId(null);
							},
							err => {
								loading.dismiss();
								presentToast(this.toastCtrl, err.message);
							}
						);
					}
				}
			]
		});
		alert.present();
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
