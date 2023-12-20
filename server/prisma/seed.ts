import { buildings, facilities, groups, users } from "./data";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const seed = async () => {
	try {
		await prisma.$transaction([
			prisma.user.createMany({ data: users }),
			prisma.group.createMany({ data: groups }),
			prisma.building.createMany({ data: buildings }),
			prisma.facility.createMany({ data: facilities }),
		]);

		console.log("Seeding complete!");
	} catch (error) {
		console.log(error);
	}
};

seed();
