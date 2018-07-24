import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController, LoadingController } from 'ionic-angular';

import { UserProvider } from '../../providers/data/user-provider';
import { User } from '../../models/user';
import { presentToast, presentLoading } from '../../utils/utils';

@IonicPage()
@Component({
	selector: 'page-user-search',
	templateUrl: 'user-search.html'
})
export class UserSearchPage {
	userType: string;
	userList: User[];
	filteredUserList: User[];

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public viewCtrl: ViewController,
		public toastCtrl: ToastController,
		public loadingCtrl: LoadingController,
		public userProvider: UserProvider
	) {
		this.userType = navParams.get('userType');
	}

	// Runs when the page has loaded. This event is NOT fired on
	// entering a view that is already cached.
	ionViewDidLoad() {
		this.getUsersByUserType();
	}

	getUsersByUserType() {
		let loading = presentLoading(this.loadingCtrl);
		this.userProvider.getUsersByUserType(this.userType).subscribe(
			(res: any) => {
				loading.dismiss();
				this.userList = res.body;
				this.initializeItems();
			},
			err => {
				loading.dismiss();
				presentToast(this.toastCtrl, err.message);
			}
		);
	}

	initializeItems() {
		this.filteredUserList = this.userList;
	}

	getItems(ev) {
		// Reset items back to all of the items
		this.initializeItems();

		// set val to the value of the ev target
		let val: string = ev.target.value;

		// if the value is an empty string don't filter the items
		if (val && val.trim() != '') {
			this.filteredUserList = this.filteredUserList.filter(user => {
				return user.name.toLowerCase().indexOf(val.toLowerCase()) > -1;
			});
		}
	}

	cancel() {
		this.viewCtrl.dismiss();
	}

	done(user: User) {
		this.viewCtrl.dismiss(user);
	}
}
