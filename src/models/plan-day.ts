import { Plan } from './plan';
import { PlanDayActivity } from './plan-day-activity';

export class PlanDay {
	id: number;
	plan: Plan;
	day: number;
	energExpend: number;
	energIntake: number;
	macrosRatioType: string;
	proEnergPct: number;
	choEnergPct: number;
	fatEnergPct: number;
	pro: number;
	cho: number;
	fat: number;
	proBodywt: number;
	planDayActivityList: PlanDayActivity[];

	dayName: string;
	checked: boolean;
	totalHours: number;
	showDetails: boolean;
	icon: string;
	proEnerg: number;
	choEnerg: number;
	fatEnerg: number;
}
