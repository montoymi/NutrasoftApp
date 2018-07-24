import { DishPart } from './dish-part';
import { Food } from './food';

export class DishPartFood {
	id: number;
	dishPart: DishPart;
	food: Food;

	weightPct: number;
	weight: number;
	pro: number;
	cho: number;
	fat: number;
	energ: number;
}
