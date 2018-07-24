import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { ActivityAddPage } from './activity-add';

@NgModule({
	declarations: [
		ActivityAddPage
	],
	imports: [
		IonicPageModule.forChild(ActivityAddPage),
		TranslateModule.forChild()
	],
	exports: [
		ActivityAddPage
	]
})
export class ActivityAddPageModule {}
