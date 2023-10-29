export type authInput = {
	image: string;
	name: string;
	employeeId: string;
	password: string;
};

export type bookingInput = {
	title: string;
	slug: string;
	purpose: string;
	employeeId: string;
	startTime: Date;
	endTime: Date;
};
