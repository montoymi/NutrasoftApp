import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, Events } from 'ionic-angular';

import { UserProvider, MenuProvider } from '../../providers/providers';
import { Menu } from '../../models/menu';
import { presentToast, presentLoading, buildMenuName } from '../../utils/utils';

@IonicPage()
@Component({
	selector: 'page-menu-detail',
	templateUrl: 'menu-detail.html'
})
export class MenuDetailPage {
	menu: Menu;

	private weekText: string;
	private dayNameList: string[] = new Array<string>();

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public toastCtrl: ToastController,
		public loadingCtrl: LoadingController,
		public translate: TranslateService,
		public userProvider: UserProvider,
		public menuProvider: MenuProvider,
		public events: Events
	) {
		this.translate.get(['WEEK', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']).subscribe(values => {
			this.weekText = values['WEEK'];
			this.dayNameList[0] = values['MONDAY'];
			this.dayNameList[1] = values['TUESDAY'];
			this.dayNameList[2] = values['WEDNESDAY'];
			this.dayNameList[3] = values['THURSDAY'];
			this.dayNameList[4] = values['FRIDAY'];
			this.dayNameList[5] = values['SATURDAY'];
			this.dayNameList[6] = values['SUNDAY'];
		});

		events.subscribe('menu:save', () => {
			this.getMenuById();
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
		this.getMenuById();
	}

	getMenuById() {
		let menuId = this.navParams.get('menuId');
		let lang: string = this.translate.getDefaultLang();

		let loading = presentLoading(this.loadingCtrl);
		this.menuProvider.getMenuById(menuId, lang).subscribe(
			(res: any) => {
				loading.dismiss();
				this.menu = res.body;

				buildMenuName(this.menu, this.weekText, this.dayNameList);
			},
			err => {
				loading.dismiss();
				presentToast(this.toastCtrl, err.message);
			}
		);
	}

	openMenuSavePage() {
		this.navCtrl.push('MenuSavePage', { menuId: this.menu.id });
	}
}
