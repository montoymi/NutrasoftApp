import { FoodGroup } from "./food-group";
import { FoodNutrient } from "./food-nutrient";

export class Food {
	ndbNo: string;
    foodGroup: FoodGroup;
    name: string;
    cost: number;
	foodNutrientList: FoodNutrient[];
	
	checked: boolean;
}