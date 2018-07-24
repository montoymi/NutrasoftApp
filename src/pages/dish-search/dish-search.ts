import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController, LoadingController } from 'ionic-angular';

import { UserProvider } from '../../providers/providers';
import { DishProvider } from '../../providers/data/dish-provider';
import { Dish } from '../../models/dish';
import { presentToast, presentLoading } from '../../utils/utils';

@IonicPage()
@Component({
	selector: 'page-dish-search',
	templateUrl: 'dish-search.html'
})
export class DishSearchPage {
	dishList: Dish[];
	filteredDishList: Dish[];

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public viewCtrl: ViewController,
		public toastCtrl: ToastController,
		public loadingCtrl: LoadingController,
		public userProvider: UserProvider,
		public dishProvider: DishProvider
	) {}

	// Runs when the page has loaded. This event is NOT fired on
	// entering a view that is already cached.
	ionViewDidLoad() {
		this.getDishesByCoachId();
	}

	getDishesByCoachId() {
		let coachId: number = this.userProvider.user.id;

		let loading = presentLoading(this.loadingCtrl);
		this.dishProvider.getDishesByCoachId(coachId).subscribe(
			(res: any) => {
				loading.dismiss();
				this.dishList = res.body;
				this.initializeItems();
			},
			err => {
				loading.dismiss();
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

	cancel() {
		this.viewCtrl.dismiss();
	}

	done(dish: Dish) {
		this.viewCtrl.dismiss(dish);
	}
}
