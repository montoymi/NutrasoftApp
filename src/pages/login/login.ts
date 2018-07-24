import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, ToastController, LoadingController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';

import { UserProvider } from '../../providers/providers';
import { User } from '../../models/user';
import { MainPage } from '../pages';
import { presentToast, presentLoading } from '../../utils/utils';
import { RESPONSE_ERROR } from '../../constants/constants';

@IonicPage()
@Component({
	selector: 'page-login',
	templateUrl: 'login.html'
})
export class LoginPage {
	user: User;

	private authUserNotFound: string;
	private authWrongPassword: string;

	constructor(
		public navCtrl: NavController,
		public toastCtrl: ToastController,
		public loadingCtrl: LoadingController,
		public translate: TranslateService,
		private afAuth: AngularFireAuth,
		public userProvider: UserProvider
	) {
		this.translate.get(['AUTH_USER_NOT_FOUND', 'AUTH_WRONG_PASSWORD']).subscribe(values => {
			this.authUserNotFound = values['AUTH_USER_NOT_FOUND'];
			this.authWrongPassword = values['AUTH_WRONG_PASSWORD'];
		});

		this.user = new User();
		//this.user.email = 'renzo@gmail.com';
		this.user.email = 'miguel.montoya.garcia@gmail.com';
		this.user.password = 'Test12';
	}

	doLogin() {
		// Se realiza el login en Firebase.
		let loading = presentLoading(this.loadingCtrl);
		this.afAuth.auth
			.signInWithEmailAndPassword(this.user.email, this.user.password)
			.then(() => {
				// Login successful.
				this.userProvider.getUserByEmail(this.user.email).subscribe(
					(res: any) => {
						loading.dismiss();
						this.navCtrl.setRoot(MainPage);
					},
					err => {
						loading.dismiss();
						presentToast(this.toastCtrl, err.message);
					}
				);
			})
			.catch(err => {
				// An error happened.
				loading.dismiss();
				switch (err.code) {
					case RESPONSE_ERROR.AUTH_USER_NOT_FOUND:
						presentToast(this.toastCtrl, this.authUserNotFound);
						break;
					case RESPONSE_ERROR.AUTH_WRONG_PASSWORD:
						presentToast(this.toastCtrl, this.authWrongPassword);
						break;
					default:
						presentToast(this.toastCtrl, err.message);
						break;
				}
			});
	}

	openSignupPage(userType: string) {
		this.navCtrl.push('SignupPage', { userType: userType });
	}
}
