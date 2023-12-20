const { faker, Aircraft } = require("@faker-js/faker");

// Enums
const roles = ["USER", "GROUP_DIRECTOR", "FACILITY_MANAGER", "ADMIN"];
const approvalStatuses = [
	"PENDING",
	"APPROVED_BY_GD",
	"APPROVED_BY_FM",
	"APPROVED_BY_ADMIN",
	"REJECTED_BY_GD",
	"REJECTED_BY_FM",
	"REJECTED_BY_ADMIN",
	"CANCELLED",
];
const cancellationStatuses = [
	"PENDING",
	"NOT_REQUESTED",
	"CANCELLED_BY_USER",
	"CANCELLED_BY_FM",
	"APPROVED_BY_GD",
	"APPROVED_BY_FM",
	"APPROVED_BY_ADMIN",
	"REJECTED_BY_GD",
	"REJECTED_BY_FM",
	"REJECTED_BY_ADMIN",
];

// Helper functions to generate random data
// const getRandomRole = () => roles[Math.floor(Math.random() * roles.length)];
// const getRandomApprovalStatus = () =>
// 	approvalStatuses[Math.floor(Math.random() * approvalStatuses.length)];
// const getRandomCancellationStatus = () =>
// 	cancellationStatuses[
// 		Math.floor(Math.random() * cancellationStatuses.length)
// 	];
//   const getRandomBool = () => Math.random() < 0.5;
const getRandomDateTime = () => faker.date.future();
const getRandomNumber = (count) => faker.number.int(count);

// Functions to generate data for each model
const generateUsers = (count) => {
	const users = [];
	for (let i = 0; i < count; i++) {
		const user = {
			image: faker.image.avatar(),
			name: faker.person.fullName(),
			employeeId: faker.number.int({ min: 100000, max: 999999 }),
			password: "password",
		};
		users.push(user);
	}
	return users;
};

// const generateBookings = (count, users, facilities) => {
//   const bookings = [];
//   for (let i = 0; i < count; i++) {
//     const booking = {
//       id: faker.random.uuid(),
//       title: faker.lorem.words(3),
//       slug: faker.lorem.slug(),
//       purpose: faker.lorem.paragraph(),
//       requestedBy: faker.random.arrayElement(users).id,
//       userId: faker.random.arrayElement(users).id,
//       status: getRandomApprovalStatus(),
//       cancellationStatus: getRandomCancellationStatus(),
//       createdAt: getRandomDateTime(),
//       cancelledAt: getRandomDateTime(),
//       cancellationRequestedAt: getRandomDateTime(),
//       facility: faker.random.arrayElement(facilities).id,
//       facilityId: faker.random.arrayElement(facilities).id,
//       // ... other booking attributes
//     };
//     bookings.push(booking);
//   }
//   return bookings;
// };

// Functions for other models
// const generateBookingTimes = (count) => {
//   const bookingTimes = [];
//   for (let i = 0; i < count; i++) {
//     const bookingTime = {
//       id: faker.random.uuid(),
//       date: faker.date.future(),
//       start: faker.date.future(),
//       end: faker.date.future(),
//       // ... other booking time attributes
//     };
//     bookingTimes.push(bookingTime);
//   }
//   return bookingTimes;
// };

const generateFacilities = (count, buildings) => {
	const facilities = [];
	for (let i = 0; i < count; i++) {
		const facility = {
			name: faker.company.name({ length: 1 }),
			description: faker.lorem.paragraph(),
			icon: faker.image.avatar(),
			slug: faker.lorem.slug(),
			createdAt: getRandomDateTime(),
			updatedAt: getRandomDateTime(),
			deletedAt: getRandomDateTime(),
			isActive: true,
			buildingId: buildings[getRandomNumber(buildings.length)].id,
			// ... other facility attributes
		};
		facilities.push(facility);
	}
	return facilities;
};

// Function to generate data for Building model
const generateBuildings = (count) => {
	const buildings = [];
	for (let i = 0; i < count; i++) {
		const building = {
			id: faker.string.uuid(),
			name: faker.company.name(),
		};
		buildings.push(building);
	}
	return buildings;
};

// Function to generate data for Group model
const generateGroups = (count) => {
	const groups = [];
	for (let i = 0; i < count; i++) {
		const group = {
			name: faker.lorem.word(),
		};
		groups.push(group);
	}
	return groups;
};

// Similar functions for other models like Building, GroupDirector, Group, FacilityManager

// Usage example: generate data for users, facilities, bookings, etc.
const users = generateUsers(10);
const buildings = generateBuildings(5);
const facilities = generateFacilities(7, buildings);
const groups = generateGroups(5);

console.log(
	JSON.stringify(
		{
			users,
			buildings,
			facilities,
			groups,
		},
		null,
		2
	)
);

module.exports = {
	users,
	buildings,
	facilities,
	groups,
};
