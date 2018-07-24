import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { DietPage } from './diet';

@NgModule({
	declarations: [
		DietPage
	],
	imports: [
		IonicPageModule.forChild(DietPage),
		TranslateModule.forChild()
	],
	exports: [
		DietPage
	]
})
export class DietPageModule {}
