import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import { PlanListPage } from './plan-list';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
	declarations: [
		PlanListPage,
	],
	imports: [
		IonicPageModule.forChild(PlanListPage),
		TranslateModule.forChild(),
		PipesModule
	],
	exports: [
		PlanListPage
	]
})
export class PlanListPageModule { }
