import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { DishListPage } from './dish-list';

@NgModule({
	declarations: [
		DishListPage
	],
	imports: [
		IonicPageModule.forChild(DishListPage),
		TranslateModule.forChild()
	],
	exports: [
		DishListPage
	]
})
export class DishListPageModule {}
