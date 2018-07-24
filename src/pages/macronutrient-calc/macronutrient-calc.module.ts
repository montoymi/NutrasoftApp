import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import { MacronutrientCalcPage } from './macronutrient-calc';

@NgModule({
	declarations: [
		MacronutrientCalcPage
	],
	imports: [
		IonicPageModule.forChild(MacronutrientCalcPage),
		TranslateModule.forChild()
	],
	exports: [
		MacronutrientCalcPage
	]
})
export class MacronutrientCalcPageModule {}
