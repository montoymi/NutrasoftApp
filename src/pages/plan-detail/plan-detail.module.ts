import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import { PlanDetailPage } from './plan-detail';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
	declarations: [
		PlanDetailPage
	],
	imports: [
		IonicPageModule.forChild(PlanDetailPage),
		TranslateModule.forChild(),
		PipesModule
	],
	exports: [
		PlanDetailPage
	]
})
export class PlanDetailPageModule {}
