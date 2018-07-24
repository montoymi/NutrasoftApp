import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController } from 'ionic-angular';

import { Tab1CoachRoot, Tab2CoachRoot, Tab3CoachRoot, Tab4CoachRoot, Tab1ClientRoot, Tab2ClientRoot, Tab3ClientRoot } from '../pages';
import { UserProvider } from '../../providers/providers';
import { USER_TYPE_COACH } from '../../constants/constants';

@IonicPage()
@Component({
	selector: 'page-tabs',
	templateUrl: 'tabs.html'
})
export class TabsPage {
	tab1CoachRoot: any = Tab1CoachRoot;
	tab2CoachRoot: any = Tab2CoachRoot;
	tab3CoachRoot: any = Tab3CoachRoot;
	tab4CoachRoot: any = Tab4CoachRoot;

	tab1ClientRoot: any = Tab1ClientRoot;
	tab2ClientRoot: any = Tab2ClientRoot;
	tab3ClientRoot: any = Tab3ClientRoot;

	tab1CoachTitle: string;
	tab2CoachTitle: string;
	tab3CoachTitle: string;
	tab4CoachTitle: string;

	tab1ClientTitle: string;
	tab2ClientTitle: string;
	tab3ClientTitle: string;

	tabs;

	constructor(public navCtrl: NavController, public translateService: TranslateService, public userProvider: UserProvider) {
		translateService
			.get(['TAB1_COACH_TITLE', 'TAB2_COACH_TITLE', 'TAB3_COACH_TITLE', 'TAB4_COACH_TITLE', 'TAB1_CLIENT_TITLE', 'TAB2_CLIENT_TITLE', 'TAB3_CLIENT_TITLE'])
			.subscribe(values => {
				this.tab1CoachTitle = values['TAB1_COACH_TITLE'];
				this.tab2CoachTitle = values['TAB2_COACH_TITLE'];
				this.tab3CoachTitle = values['TAB3_COACH_TITLE'];
				this.tab4CoachTitle = values['TAB4_COACH_TITLE'];
				this.tab1ClientTitle = values['TAB1_CLIENT_TITLE'];
				this.tab2ClientTitle = values['TAB2_CLIENT_TITLE'];
				this.tab3ClientTitle = values['TAB3_CLIENT_TITLE'];
			});

		if (userProvider.user.userType == USER_TYPE_COACH) {
			this.tabs = [
				{ title: this.tab1CoachTitle, root: this.tab1CoachRoot, icon: 'trending-up' },
				{ title: this.tab2CoachTitle, root: this.tab2CoachRoot, icon: 'restaurant' },
				{ title: this.tab3CoachTitle, root: this.tab3CoachRoot, icon: 'calendar' },
				{ title: this.tab4CoachTitle, root: this.tab4CoachRoot, icon: 'person' }
			];
		} else {
			this.tabs = [
				{ title: this.tab1ClientTitle, root: this.tab1ClientRoot, icon: 'nutrition' },
				{ title: this.tab2ClientTitle, root: this.tab2ClientRoot, icon: 'body' },
				{ title: this.tab3ClientTitle, root: this.tab3ClientRoot, icon: 'person' }
			];
		}
	}
}
