import { Component } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { TranslateService } from '@ngx-translate/core';
import { Config, Platform } from 'ionic-angular';
import { Globalization } from '@ionic-native/globalization';

import { FirstRunPage, MainPage } from '../pages/pages';
import { Settings, UserProvider } from '../providers/providers';
import { User } from '../models/user';

@Component({
	template: `<ion-nav #content [root]="rootPage"></ion-nav>`
})
export class MyApp {
	rootPage;

	constructor(
		private translate: TranslateService,
		public platform: Platform,
		private settings: Settings,
		private config: Config,
		private statusBar: StatusBar,
		private splashScreen: SplashScreen,
		public userProvider: UserProvider,
		private globalization: Globalization
	) {
		this.initializeApp();
		this.initTranslate();
	}

	initializeApp() {
		this.platform.ready().then(() => {
			// Okay, so the platform is ready and our plugins are available.
			// Here you can do any higher level native things you might need.
			this.statusBar.styleDefault();
			this.splashScreen.hide();
		});
	}

	initTranslate() {
		// Set the default language for translation strings, and the current language.
		this.translate.setDefaultLang('es');

		// Asigna el idioma por defecto según el idioma del dispositivo.
		this.globalization
			.getPreferredLanguage()
			.then(res => {
				// El lenguaje retorna en formato es-US.
				let lang = res.value.split('-')[0];
				this.setLangAndRootPage(lang);
			})
			.catch(err => {
				// Cuando se ejecuta desde el navegador entra
				// a esta parte, porque no carga las librerias
				// de cordova.
				this.setLangAndRootPage(this.translate.getDefaultLang());
			});

		this.translate.get(['BACK_BUTTON_TEXT']).subscribe(values => {
			this.config.set('ios', 'backButtonText', values.BACK_BUTTON_TEXT);
		});
	}

	setLangAndRootPage(lang: string) {
		this.translate.use(lang);

		// Obtiene el usuario de la configuración.
		this.settings.getValue('user').then((user: User) => {
			if (user) {
				// User is signed in.
				this.userProvider.user = user;
				this.rootPage = MainPage;
			} else {
				// User isn't signed in.
				this.rootPage = FirstRunPage;
			}
		});
	}
}
