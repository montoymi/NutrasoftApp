import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController, LoadingController } from 'ionic-angular';

import { DishProvider } from '../../providers/providers';
import { NutrientRatio } from '../../models/nutrient-ratio';
import { Item } from '../../models/item';
import { presentLoading, presentToast } from '../../utils/utils';

@IonicPage()
@Component({
	selector: 'page-macronutrient-set',
	templateUrl: 'macronutrient-set.html'
})
export class MacronutrientSetPage {
	nutrientRatioList: NutrientRatio[];
	groupArray;

	// Macronutrient seleccionado.
	nutrientRatio: NutrientRatio;

	private biotypeEctomorph: string;
	private biotypeMesomorph: string;
	private biotypeEndomorph: string;
	private proText: string;
	private choText: string;
	private fatText: string;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public viewCtrl: ViewController,
		public toastCtrl: ToastController,
		public loadingCtrl: LoadingController,
		private translate: TranslateService,
		public dishProvider: DishProvider
	) {
		this.translate.get(['BIOTYPE_ECTOMORPH', 'BIOTYPE_MESOMORPH', 'BIOTYPE_ENDOMORPH', 'PRO', 'CHO', 'FAT']).subscribe(values => {
			this.biotypeEctomorph = values['BIOTYPE_ECTOMORPH'];
			this.biotypeMesomorph = values['BIOTYPE_MESOMORPH'];
			this.biotypeEndomorph = values['BIOTYPE_ENDOMORPH'];
			this.proText = values['PRO'];
			this.choText = values['CHO'];
			this.fatText = values['FAT'];
		});

		this.getNutrientRatioList();
	}

	getNutrientRatioList() {
		let lang: string = this.translate.getDefaultLang();

		let loading = presentLoading(this.loadingCtrl);
		this.dishProvider.getAllNutrientRatios(lang).subscribe(
			(res: any) => {
				loading.dismiss();
				this.nutrientRatioList = res.body;

				for (let nutrientRatio of this.nutrientRatioList) {
					switch (nutrientRatio.biotype) {
						case 'ECT':
							nutrientRatio.biotype = this.biotypeEctomorph;
							break;
						case 'MES':
							nutrientRatio.biotype = this.biotypeMesomorph;
							break;
						case 'END':
							nutrientRatio.biotype = this.biotypeEndomorph;
							break;
					}

					nutrientRatio.ratio =
						this.proText + ' ' + nutrientRatio.proEnergPct + ' : ' + this.choText + ' ' + nutrientRatio.choEnergPct + ' : ' + this.fatText + ' ' + nutrientRatio.fatEnergPct;
				}

				this.groupArray = this.buildGroupArray(this.nutrientRatioList);
			},
			err => {
				loading.dismiss();
				presentToast(this.toastCtrl, err.message);
			}
		);
	}

	cancel() {
		this.viewCtrl.dismiss();
	}

	done() {
		this.viewCtrl.dismiss(this.nutrientRatio);
	}

	/*
	 * Funciones para el agrupamiento.
	 */

	buildGroupArray(nutrientRatioList: NutrientRatio[]) {
		let groupArray = new Array<Item>();

		// Crea el array de grupos.
		for (let nutrientRatio of nutrientRatioList) {
			if (!this.contains(groupArray, nutrientRatio.goal)) {
				let group: Item = new Item({
					goal: nutrientRatio.goal,
					nutrientRatioArray: new Array<NutrientRatio>(),
					showDetails: true,
					icon: 'ios-arrow-up'
				});
				groupArray.push(group);
			}
		}

		// Asigna los items a cada grupo.
		for (let group of groupArray) {
			for (let nutrientRatio of nutrientRatioList) {
				if (nutrientRatio.goal.id == group.goal.id) {
					group.nutrientRatioArray.push(nutrientRatio);
				}
			}
		}

		return groupArray;
	}

	contains(groupArray: Array<Item>, goal: Item) {
		for (let group of groupArray) {
			if (group.goal.id == goal.id) {
				return true;
			}
		}

		return false;
	}

	toggleDetails(group) {
		if (group.showDetails) {
			group.showDetails = false;
			group.icon = 'ios-arrow-down';
		} else {
			group.showDetails = true;
			group.icon = 'ios-arrow-up';
		}
	}
}
