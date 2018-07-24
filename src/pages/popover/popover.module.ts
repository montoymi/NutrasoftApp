import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import { PopoverPage } from './popover';

@NgModule({
	declarations: [
		PopoverPage
	],
	imports: [
		IonicPageModule.forChild(PopoverPage),
		TranslateModule.forChild()
	],
	exports: [
		PopoverPage
	]
})
export class PopoverPageModule {}
