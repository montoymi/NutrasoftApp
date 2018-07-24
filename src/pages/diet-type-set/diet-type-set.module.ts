import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import { DietTypeSetPage } from './diet-type-set';

@NgModule({
	declarations: [
		DietTypeSetPage
	],
	imports: [
		IonicPageModule.forChild(DietTypeSetPage),
		TranslateModule.forChild()
	],
	exports: [
		DietTypeSetPage
	]
})
export class DietTypeSetPageModule {}
