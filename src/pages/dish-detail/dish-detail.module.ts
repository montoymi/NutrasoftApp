import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import { DishDetailPage } from './dish-detail';

@NgModule({
	declarations: [
		DishDetailPage
	],
	imports: [
		IonicPageModule.forChild(DishDetailPage),
		TranslateModule.forChild()
	],
	exports: [
		DishDetailPage
	]
})
export class DishDetailPageModule {}
