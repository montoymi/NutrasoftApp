import { User } from './user';
import { Item } from './item';
import { PlanDay } from './plan-day';

export class Plan {
	id: number;
	client: User;
	goal: Item;
	beginDate: any;
	endDate: any;
	height: number;
	neck: number;
	waist: number;
	hip: number;
	weight: number;
	hrMax: number;
	energBasal: number;
	energVariationPct: number;
	choEnergPct: number;
	biotype: string;
	planDayList: PlanDay[];

	status: string;
}
