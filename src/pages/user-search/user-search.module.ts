import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import { UserSearchPage } from './user-search';

@NgModule({
	declarations: [
		UserSearchPage
	],
	imports: [
		IonicPageModule.forChild(UserSearchPage), 
		TranslateModule.forChild()
	],
	exports: [
		UserSearchPage
	]
})
export class UserSearchPageModule {}
