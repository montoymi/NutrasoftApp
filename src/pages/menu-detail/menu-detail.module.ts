import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { MenuDetailPage } from './menu-detail';

@NgModule({
	declarations: [
		MenuDetailPage
	],
	imports: [
		IonicPageModule.forChild(MenuDetailPage),
		TranslateModule.forChild()
	]
})
export class MenuDetailPageModule {}
