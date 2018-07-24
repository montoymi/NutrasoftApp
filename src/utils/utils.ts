import { ToastController, LoadingController } from 'ionic-angular';
import * as moment from 'moment';

import { DATE_FORMAT_ISO8601_Z } from '../constants/constants';
import { Menu } from '../models/menu';

// Se asigna el formato ISO 8601 para poder manejar el dato como fecha con zona horaria.
export function formatISO8601_Z(value) {
	return value != undefined ? moment(value, DATE_FORMAT_ISO8601_Z).format() : value;
}

export function presentToast(toastCtrl: ToastController, message: string) {
	let toast = toastCtrl.create({
		message: message,
		duration: 3000,
		position: 'top'
	});
	toast.present();
}

export function presentLoading(loadingCtrl: LoadingController) {
	let loading = loadingCtrl.create();
	loading.present();
	return loading;
}

export function getStringValue(value) {
	return value == null || value == '' ? null : value;
}

export function valueOfPct(pct: number, total: number): number {
	return (pct * total) / 100;
}

export function round(value, scale) {
	var multiplier = Math.pow(10, scale);
	return Math.round(value * multiplier) / multiplier;
}

export function buildMenuName(menu: Menu, weekText: string, dayNameList: string[]) {
	menu.weekName = weekText + ' ' + menu.week;
	menu.dayName = dayNameList[menu.day - 1];
	menu.name = menu.weekName + ', ' + menu.dayName;
}
