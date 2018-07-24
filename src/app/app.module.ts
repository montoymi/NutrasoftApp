import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Camera } from '@ionic-native/camera';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicStorageModule, Storage } from '@ionic/storage';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { WheelSelector } from '@ionic-native/wheel-selector';
import { Globalization } from '@ionic-native/globalization';

import { MyApp } from './app.component';
import { Settings, Api, UserProvider, PlanProvider, DietProvider, DishProvider, FoodProvider, MeasurementProvider, PreferenceProvider, MenuProvider } from '../providers/providers';
import { environment } from '../environments/environment';

// The translate loader needs to know where to load i18n files
// in Ionic's static asset pipeline.
export function createTranslateLoader(http: HttpClient) {
	return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export function provideSettings(storage: Storage) {
	/**
	 * The Settings provider takes a set of default settings for your app.
	 *
	 * You can add new settings options at any time. Once the settings are saved,
	 * these values will not overwrite the saved values (this can be done manually if desired).
	 */
	return new Settings(storage, {
		option1: true,
		option2: 'Ionitron J. Framework',
		option3: '3',
		option4: 'Hello'
	});
}

@NgModule({
	declarations: [
		MyApp
	],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		HttpClientModule,
		TranslateModule.forRoot({
			loader: {
				provide: TranslateLoader,
				useFactory: createTranslateLoader,
				deps: [HttpClient]
			}
		}),
		IonicModule.forRoot(MyApp),
		IonicStorageModule.forRoot(),
		AngularFireModule.initializeApp(environment.firebase),
		AngularFireAuthModule
	],
	bootstrap: [IonicApp],
	entryComponents: [
		MyApp
	],
	providers: [
		Api,
		UserProvider,
		PlanProvider,
		DietProvider,
		DishProvider,
		FoodProvider,
		MeasurementProvider,
		PreferenceProvider,
		MenuProvider,
		Camera,
		SplashScreen,
		StatusBar,
		WheelSelector,
		Globalization,
		{ provide: Settings, useFactory: provideSettings, deps: [Storage] },
		// Keep this to enable Ionic's runtime error handling during development
		{ provide: ErrorHandler, useClass: IonicErrorHandler }
	]
})
export class AppModule {}
