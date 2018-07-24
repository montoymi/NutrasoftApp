import { Menu } from "./menu";
import { Meal } from "./meal";
import { Dish } from "./dish";

export class MenuMeal {
    id: number;
    menu: Menu;
    meal: Meal;
	dish: Dish;

	showDetails: boolean;
	icon: string;
}