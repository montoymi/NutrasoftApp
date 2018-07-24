import { Plan } from "./plan";

export class User {
	id: number;
	coach: User;
	userType: string;
	name: string;
	gender: string;
	birthdate: any;
	email: string;
	phone: string;
	photo: string;
	summary: string;
	planList: Plan[];

	password: string;
	newPassword: string;
	showDetails: boolean;
	icon: string;
}
