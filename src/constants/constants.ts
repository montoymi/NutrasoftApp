export enum RESPONSE_STATUS {
	OK = 200,
	CREATED = 201
}

export enum RESPONSE_ERROR {
	AUTH_USER_NOT_FOUND = "auth/user-not-found",
	AUTH_WRONG_PASSWORD = "auth/wrong-password",
	AUTH_EMAIL_ALREADY_IN_USE = "auth/email-already-in-use",
	DIET_PLAN_NOT_FOUND = "diet/plan-not-found",
	DIET_MENU_NOT_FOUND = "diet/menu-not-found",
	MEAS_PLAN_NOT_FOUND = "meas/plan-not-found"
}

export const USER_NAME_MAX_LENGTH = 15;
export const PASSWORD_MIN_LENGTH = 6;

export const PASSWORD_PATTERN = '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$';
export const EMAIL_PATTERN = '^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$';

export const DATE_FORMAT_ISO8601_Z = 'YYYY-MM-DDTHH:mm:ss Z';

export const USER_TYPE_COACH = "COACH";
export const USER_TYPE_CLIENT = "CLIENT";

export const MACROS_RATIO_TYPE_DEFAULT = "DEF";
export const MACROS_RATIO_TYPE_CUSTOM = "CUS";