import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { IonicStepperModule } from 'ionic-stepper';

import { PlanSavePage } from './plan-save';

@NgModule({
	declarations: [
		PlanSavePage
	],
	imports: [
		IonicStepperModule,
		IonicPageModule.forChild(PlanSavePage),
		TranslateModule.forChild()
	],
	exports: [
		PlanSavePage
	]
})
export class PlanSavePageModule { }
