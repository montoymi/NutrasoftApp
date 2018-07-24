import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, NavParams, PopoverController, ToastController, LoadingController, AlertController, Refresher, Events } from 'ionic-angular';

import { UserProvider, MenuProvider } from '../../providers/providers';
import { DietType } from '../../models/diet-type';
import { Menu } from '../../models/menu';
import { presentToast, presentLoading, buildMenuName } from '../../utils/utils';

@IonicPage()
@Component({
	selector: 'page-menu-list',
	templateUrl: 'menu-list.html'
})
export class MenuListPage {
	dietTypeList: DietType[];
	filteredDietTypeList: DietType[];

	private confirmTitle: string;
	private confirmMessage: string;
	private cancelButton: string;
	private okButton: string;
	private deleteMenuSuccess: string;

	private dietText: string;
	private weekText: string;
	private dayNameList: string[] = new Array<string>();

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public popoverCtrl: PopoverController,
		public toastCtrl: ToastController,
		public loadingCtrl: LoadingController,
		private alertCtrl: AlertController,
		public translate: TranslateService,
		public userProvider: UserProvider,
		public menuProvider: MenuProvider,
		public events: Events
	) {
		this.translate.get(['DIET', 'DELETE_MENU_CONFIRM_TITLE', 'DELETE_MENU_CONFIRM_MESSAGE', 'CANCEL_BUTTON', 'OK_BUTTON', 'DELETE_MENU_SUCCESS']).subscribe(values => {
			this.dietText = values['DIET'];
			this.confirmTitle = values['DELETE_MENU_CONFIRM_TITLE'];
			this.confirmMessage = values['DELETE_MENU_CONFIRM_MESSAGE'];
			this.cancelButton = values['CANCEL_BUTTON'];
			this.okButton = values['OK_BUTTON'];
			this.deleteMenuSuccess = values['DELETE_MENU_SUCCESS'];
		});

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
			this.getDietTypesByCoachId(null);
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
		this.getDietTypesByCoachId(null);
	}

	presentPopover(event: Event) {
		let popover = this.popoverCtrl.create('PopoverPage');
		popover.present({ ev: event });
	}

	getDietTypesByCoachId(refresher: Refresher) {
		let coachId: number = this.userProvider.user.id;
		let lang: string = this.translate.getDefaultLang();

		this.menuProvider.getDietTypesByCoachId(coachId, lang).subscribe(
			(res: any) => {
				if (refresher) refresher.complete();
				this.dietTypeList = res.body;
				this.initializeItems();

				// Inicializa propiedades del grupo.
				for (let dietType of this.dietTypeList) {
					dietType.name = this.dietText + ' ' + dietType.name.toLowerCase();

					for (let menu of dietType.menuList) {
						buildMenuName(menu, this.weekText, this.dayNameList);
					}

					dietType.showDetails = true;
					dietType.icon = 'ios-arrow-up';
				}
			},
			err => {
				if (refresher) refresher.complete();
				presentToast(this.toastCtrl, err.message);
			}
		);
	}

	initializeItems() {
		this.filteredDietTypeList = this.dietTypeList;
	}

	getItems(ev) {
		// Reset items back to all of the items
		this.initializeItems();

		// set val to the value of the ev target
		let val: string = ev.target.value;

		// if the value is an empty string don't filter the items
		if (val && val.trim() != '') {
			this.filteredDietTypeList = this.filteredDietTypeList.filter(dietType => {
				return dietType.name.toLowerCase().indexOf(val.toLowerCase()) > -1;
			});
		}
	}

	openMenuSavePage() {
		this.navCtrl.push('MenuSavePage');
	}

	openMenuDetailPage(menu: Menu) {
		this.navCtrl.push('MenuDetailPage', { menuId: menu.id });
	}

	deleteMenu(menu: Menu) {
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
						this.menuProvider.deleteMenu(menu.id).subscribe(
							(res: any) => {
								loading.dismiss();
								presentToast(this.toastCtrl, this.deleteMenuSuccess);
								this.getDietTypesByCoachId(null);
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
