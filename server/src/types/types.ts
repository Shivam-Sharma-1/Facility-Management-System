import { Role } from "@prisma/client";

export type AuthInput = {
	image: string;
	name: string;
	employeeId: number;
	password: string;
	role: Role;
};

export type BookingInput = {
	title: string;
	slug: string;
	purpose: string;
	employeeId: number;
	date: Date;
	start: Date;
	end: Date;
};
