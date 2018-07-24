import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import { PreferenceSavePage } from './preference-save';

@NgModule({
	declarations: [
		PreferenceSavePage
	],
	imports: [
		IonicPageModule.forChild(PreferenceSavePage),
		TranslateModule.forChild()
	],
	exports: [
		PreferenceSavePage
	]
})
export class PreferenceSavePageModule {}
