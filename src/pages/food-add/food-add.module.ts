import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import { FoodAddPage } from './food-add';

@NgModule({
	declarations: [
		FoodAddPage
	],
	imports: [
		IonicPageModule.forChild(FoodAddPage),
		TranslateModule.forChild()
	],
	exports: [
		FoodAddPage
	]
})
export class FoodAddPageModule {}
