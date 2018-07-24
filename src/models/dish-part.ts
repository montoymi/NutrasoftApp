import { Dish } from "./dish";
import { DishPartFood } from "./dish-part-food";

export class DishPart {
	id: number;
	dish: Dish;
	partCode: string;
	dishPartFoodList: DishPartFood[];

	partName: string;
	showDetails: boolean;
	icon: string;
}