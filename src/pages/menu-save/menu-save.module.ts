import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import { MenuSavePage } from './menu-save';

@NgModule({
	declarations: [
		MenuSavePage
	],
	imports: [
		IonicPageModule.forChild(MenuSavePage),
		TranslateModule.forChild()
	],
	exports: [
		MenuSavePage
	]
})
export class MenuSavePageModule {}
