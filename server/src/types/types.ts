export type AuthInput = {
	image: string;
	name: string;
	employeeId: string;
	password: string;
};

export type BookingInput = {
	title: string;
	slug: string;
	purpose: string;
	color: string;
	employeeId: string;
	date: Date;
	startTime: Date;
	endTime: Date;
};
