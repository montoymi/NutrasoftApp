import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import { DishValidatorPage } from './dish-validator';

@NgModule({
	declarations: [
		DishValidatorPage
	],
	imports: [
		IonicPageModule.forChild(DishValidatorPage),
		TranslateModule.forChild()
	],
	exports: [
		DishValidatorPage
	]
})
export class DishValidatorPageModule {}
