import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import { DishSearchPage } from './dish-search';

@NgModule({
	declarations: [
		DishSearchPage
	],
	imports: [
		IonicPageModule.forChild(DishSearchPage),
		TranslateModule.forChild()
	],
	exports: [
		DishSearchPage
	]
})
export class DishSearchPageModule {}
