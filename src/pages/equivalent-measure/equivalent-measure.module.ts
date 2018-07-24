import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import { EquivalentMeasurePage } from './equivalent-measure';

@NgModule({
	declarations: [
		EquivalentMeasurePage
	],
	imports: [
		IonicPageModule.forChild(EquivalentMeasurePage),
		TranslateModule.forChild()
	],
	exports: [
		EquivalentMeasurePage
	]
})
export class EquivalentMeasurePageModule {}
