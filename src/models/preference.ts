import { User } from "./user";
import { DietType } from "./diet-type";
import { ExcludedFood } from "./excluded-food";

export class Preference {
	user: User;
	dietType: DietType;
	mealCount: number;
	excludedFoodList: ExcludedFood[];
}