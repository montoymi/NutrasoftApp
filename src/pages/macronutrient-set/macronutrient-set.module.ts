import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import { MacronutrientSetPage } from './macronutrient-set';

@NgModule({
	declarations: [
		MacronutrientSetPage
	],
	imports: [
		IonicPageModule.forChild(MacronutrientSetPage),
		TranslateModule.forChild()
	],
	exports: [
		MacronutrientSetPage
	]
})
export class MacronutrientSetPageModule {}
