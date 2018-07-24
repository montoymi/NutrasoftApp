import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, NavParams, PopoverController, ToastController, LoadingController, AlertController, Refresher, Events } from 'ionic-angular';

import { UserProvider, DishProvider } from '../../providers/providers';
import { Dish } from '../../models/dish';
import { presentToast, presentLoading } from '../../utils/utils';

@IonicPage()
@Component({
	selector: 'page-dish-list',
	templateUrl: 'dish-list.html'
})
export class DishListPage {
	dishList: Dish[];
	filteredDishList: Dish[];

	private confirmTitle: string;
	private confirmMessage: string;
	private cancelButton: string;
	private okButton: string;
	private deleteDishSuccess: string;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public popoverCtrl: PopoverController,
		public toastCtrl: ToastController,
		public loadingCtrl: LoadingController,
		private alertCtrl: AlertController,
		public translate: TranslateService,
		public userProvider: UserProvider,
		public dishProvider: DishProvider,
		public events: Events
	) {
		this.translate.get(['DELETE_DISH_CONFIRM_TITLE', 'DELETE_DISH_CONFIRM_MESSAGE', 'CANCEL_BUTTON', 'OK_BUTTON', 'DELETE_DISH_SUCCESS']).subscribe(values => {
			this.confirmTitle = values['DELETE_DISH_CONFIRM_TITLE'];
			this.confirmMessage = values['DELETE_DISH_CONFIRM_MESSAGE'];
			this.cancelButton = values['CANCEL_BUTTON'];
			this.okButton = values['OK_BUTTON'];
			this.deleteDishSuccess = values['DELETE_DISH_SUCCESS'];
		});

		events.subscribe('dish:save', () => {
			this.getDishesByCoachId(null);
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
		this.getDishesByCoachId(null);
	}

	presentPopover(event: Event) {
		let popover = this.popoverCtrl.create('PopoverPage');
		popover.present({ ev: event });
	}

	getDishesByCoachId(refresher: Refresher) {
		let coachId: number = this.userProvider.user.id;

		this.dishProvider.getDishesByCoachId(coachId).subscribe(
			(res: any) => {
				if (refresher) refresher.complete();
				this.dishList = res.body;
				this.initializeItems();
			},
			err => {
				if (refresher) refresher.complete();
				presentToast(this.toastCtrl, err.message);
			}
		);
	}

	initializeItems() {
		this.filteredDishList = this.dishList;
	}

	getItems(ev) {
		// Reset items back to all of the items
		this.initializeItems();

		// set val to the value of the ev target
		let val: string = ev.target.value;

		// if the value is an empty string don't filter the items
		if (val && val.trim() != '') {
			this.filteredDishList = this.filteredDishList.filter(dish => {
				return dish.name.toLowerCase().indexOf(val.toLowerCase()) > -1;
			});
		}
	}

	openDishSavePage() {
		this.navCtrl.push('DishSavePage');
	}

	openDishDetailPage(dish: Dish) {
		this.navCtrl.push('DishDetailPage', { dishId: dish.id });
	}

	deleteDish(dish: Dish) {
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
						this.dishProvider.deleteDish(dish.id).subscribe(
							(res: any) => {
								loading.dismiss();
								presentToast(this.toastCtrl, this.deleteDishSuccess);
								this.getDishesByCoachId(null);
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
}
