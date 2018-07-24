import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import { FoodAdd2Page } from './food-add2';

@NgModule({
	declarations: [
		FoodAdd2Page
	],
	imports: [
		IonicPageModule.forChild(FoodAdd2Page),
		TranslateModule.forChild()
	],
	exports: [
		FoodAdd2Page
	]
})
export class FoodAdd2PageModule {}
