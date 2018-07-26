import { Item } from './item';

export class NutrientRatio {
	id: number;
	goal: Item;
	biotype: string;
	proEnergPct: number;
	choEnergPct: number;
	fatEnergPct: number;

	ratio: string;
}
