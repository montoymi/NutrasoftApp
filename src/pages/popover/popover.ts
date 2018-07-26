import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';

import { UserProvider } from '../../providers/providers';
import { FirstRunPage } from '../pages';

@IonicPage()
@Component({
	selector: 'page-popover',
	templateUrl: 'popover.html'
})
export class PopoverPage {
	userType: string;

	constructor(
		public navCtrl: NavController, 
		public navParams: NavParams,
		public viewCtrl: ViewController,
		private afAuth: AngularFireAuth,
		public userProvider: UserProvider
	) {
		this.userType = userProvider.user.userType;
	}

	openPreferenceSavePage() {
		this.navCtrl.push('PreferenceDetailPage');
		this.viewCtrl.dismiss();
	}

	logout() {
		this.afAuth.auth.signOut();
		this.userProvider.logout();
		this.viewCtrl.dismiss();
		this.navCtrl.setRoot(FirstRunPage);
	}
}
