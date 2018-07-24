import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController, ModalController } from 'ionic-angular';

import { UserProvider } from '../../providers/providers';
import { User } from '../../models/user';

@IonicPage()
@Component({
	selector: 'page-user-detail',
	templateUrl: 'user-detail.html'
})
export class UserDetailPage {
	user: User;

	constructor(
		public navCtrl: NavController, 
		public navParams: NavParams,
		public popoverCtrl: PopoverController,
		public modalCtrl: ModalController, 
		public userProvider: UserProvider
	) {}

	ionViewCanEnter(): boolean {
		if (!this.userProvider.user) {
			return false;
		}

		return true;
	}

	// Runs when the page is about to enter and become the active page.
	ionViewWillEnter() {
		this.user = this.userProvider.user;
	}

	presentPopover(event: Event) {
		let popover = this.popoverCtrl.create('PopoverPage');
		popover.present({ ev: event });
	}

	openUserSavePage() {
		this.navCtrl.push('UserSavePage');
	}

	openChangePasswordPage() {
		let modal = this.modalCtrl.create('ChangePasswordPage');
		modal.present();
	}
}
