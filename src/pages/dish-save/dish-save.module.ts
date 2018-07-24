import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import { DishSavePage } from './dish-save';

@NgModule({
	declarations: [
		DishSavePage
	],
	imports: [
		IonicPageModule.forChild(DishSavePage),
		TranslateModule.forChild()
	],
	exports: [
		DishSavePage
	]
})
export class DishSavePageModule {}
