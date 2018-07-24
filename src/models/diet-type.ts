import { Menu } from './menu';

export class DietType {
	id: number;
	name: string;
	description: string;
	menuList: Menu[];

	showDetails: boolean;
	icon: string;
}
