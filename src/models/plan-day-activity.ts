import { PlanDay } from "./plan-day";
import { Item } from "./item";

export class PlanDayActivity {
	id: number;
	planDay: PlanDay;
	activity: Item;
	time: number;
}