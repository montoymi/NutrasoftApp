import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { MeasurementPage } from './measurement';

@NgModule({
	declarations: [
		MeasurementPage
	],
	imports: [
		IonicPageModule.forChild(MeasurementPage),
		TranslateModule.forChild()

	],
	exports: [
		MeasurementPage
	]
})
export class MeasurementPageModule {}
