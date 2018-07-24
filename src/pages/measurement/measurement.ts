import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, NavParams, PopoverController, ToastController, LoadingController } from 'ionic-angular';

import { UserProvider, MeasurementProvider } from '../../providers/providers';
import { Measurement } from '../../models/measurement';
import { presentLoading, presentToast } from '../../utils/utils';
import { RESPONSE_ERROR } from '../../constants/constants';

@IonicPage()
@Component({
	selector: 'page-measurement',
	templateUrl: 'measurement.html'
})
export class MeasurementPage {
	measurement: Measurement;

	private measPlanNotFound: string;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public popoverCtrl: PopoverController,
		public toastCtrl: ToastController,
		public loadingCtrl: LoadingController,
		public translate: TranslateService,
		public userProvider: UserProvider,
		public measurementProvider: MeasurementProvider
	) {
		this.translate.get(['MEAS_PLAN_NOT_FOUND']).subscribe(values => {
			this.measPlanNotFound = values['MEAS_PLAN_NOT_FOUND'];
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
		this.calculateMeasurement();
	}

	presentPopover(event: Event) {
		let popover = this.popoverCtrl.create('PopoverPage');
		popover.present({ ev: event });
	}

	calculateMeasurement() {
		let clientId: number = this.userProvider.user.id;

		let loading = presentLoading(this.loadingCtrl);
		this.measurementProvider.calculateMeasurement(clientId).subscribe(
			(res: any) => {
				loading.dismiss();
				this.measurement = res.body;
			},
			err => {
				loading.dismiss();
				switch (err.error) {
					case RESPONSE_ERROR.MEAS_PLAN_NOT_FOUND:
						presentToast(this.toastCtrl, this.measPlanNotFound);
						break;
					default:
						presentToast(this.toastCtrl, err.message);
						break;
				}
			}
		);
	}
}
