import { Role } from "@prisma/client";

export type AuthInput = {
	image: string;
	fullName: string;
	employeeId: string;
	password: string;
	role: Role;
	name: string;
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
