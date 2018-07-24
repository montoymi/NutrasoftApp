import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, NavParams, ToastController, Events } from 'ionic-angular';

import { UserProvider, PreferenceProvider } from '../../providers/providers';
import { Preference } from '../../models/preference';
import { presentToast } from '../../utils/utils';

@IonicPage()
@Component({
	selector: 'page-preference-detail',
	templateUrl: 'preference-detail.html'
})
export class PreferenceDetailPage {
	preference: Preference;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public toastCtrl: ToastController,
		public translate: TranslateService,
		public userProvider: UserProvider,
		public preferenceProvider: PreferenceProvider,
		public events: Events
	) {
		events.subscribe('preference:save', () => {
			this.getPreferenceByUserId();
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
		this.getPreferenceByUserId();
	}

	getPreferenceByUserId() {
		let userId = this.userProvider.user.id;
		let lang: string = this.translate.getDefaultLang();

		this.preferenceProvider.getPreferenceByUserId(userId, lang).subscribe(
			(res: any) => {
				this.preference = res.body;
			},
			err => {
				presentToast(this.toastCtrl, err.message);
			}
		);
	}

	openPreferenceSavePage() {
		this.navCtrl.push('PreferenceSavePage');
	}
}
