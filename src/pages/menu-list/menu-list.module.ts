import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { MenuListPage } from './menu-list';

@NgModule({
	declarations: [
		MenuListPage
	],
	imports: [
		IonicPageModule.forChild(MenuListPage),
		TranslateModule.forChild()
	],
	exports: [
		MenuListPage
	]
})
export class MenuListPageModule {}
