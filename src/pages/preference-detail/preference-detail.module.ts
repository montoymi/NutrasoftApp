import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import { PreferenceDetailPage } from './preference-detail';

@NgModule({
	declarations: [
		PreferenceDetailPage
	],
	imports: [
		IonicPageModule.forChild(PreferenceDetailPage),
		TranslateModule.forChild()
	],
	exports: [
		PreferenceDetailPage
	]
})
export class PreferenceDetailPageModule {}
