import { DietType } from "./diet-type";
import { MenuMeal } from "./menu-meal";
import { PlanDay } from "./plan-day";

export class Menu {
    id: number;
    coach: number;
    dietType: DietType;
    week: number;
    day: number;
	menuMealList: MenuMeal[];
	
	planDay: PlanDay;
	weekName: string;
	dayName: string;
	name: string;
}