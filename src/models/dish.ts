import { User } from './user';
import { DishPart } from './dish-part';
import { DishPartFood } from './dish-part-food';

export class Dish {
	id: number;
	coach: User;
	name: string;
	dishPartList: DishPart[];

	totalPro: number;
	totalCho: number;
	totalFat: number;
	totalEnerg: number;

	dishPartFoodList: DishPartFood[];
}
