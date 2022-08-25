import { PrismaClient } from '@prisma/client';
import * as argon from 'argon2';
import {
  Countries,
  Types,
  Users,
  Houses,
  Photos,
  Animals,
  Plants,
  Absences,
} from '.';
import { UserType } from '../src/user/types/';
import { CreateHouseDto } from '../src/house/dto/';
import { CountryType } from '../src/country/types/';
import { Type } from '../src/type/types/';
import { PhotoDto } from '../src/photo/dto/';
import { AnimalDto } from '../src/animal/dto/';
import { PlantDto } from '../src/plant/dto/';
import { AbsenceDto } from '../src/absence/dto';

const prisma = new PrismaClient();

Users: [UserType];
Houses: [CreateHouseDto];
Countries: [CountryType];
Types: [Type];
Photos: [PhotoDto];
Animals: [AnimalDto];
Plants: [PlantDto];
Absences: [AbsenceDto];

async function main() {
  try {
    for (const country of Countries) {
      await prisma.country.create({
        data: {
          ...country,
        },
      });
    }

    for (const type of Types) {
      await prisma.type.create({
        data: {
          ...type,
        },
      });
    }

    for (const user of Users) {
      user.password = await argon.hash(user.password);
      await prisma.user.create({
        data: {
          ...user,
        },
      });
    }

    const country = await prisma.country.findUnique({
      where: { country: 'France' },
    });

    if (!country) {
      throw new Error('Country not found');
    }

    const typesId = (await prisma.type.findMany()).map((type) => type.id);
    const usersId = (await prisma.user.findMany()).map((user) => user.id);

    for (const [index, house] of Houses.entries()) {
      const user_id: string = usersId[index];
      const type_id: string =
        typesId[Math.floor(Math.random() * typesId.length)];
      await prisma.house.create({
        data: {
          ...house,
          user_id,
          country_id: country.id,
          type_id,
        },
      });
    }

    const housesId = (await prisma.house.findMany()).map((house) => house.id);
    const house_id = housesId[housesId.length - 1];

    for (const photo of Photos) {
      const user_id = usersId[0];
      await prisma.photo.create({
        data: {
          user_id,
          house_id,
          ...photo,
        },
      });
    }

    for (const animal of Animals) {
      const user_id = usersId[0];
      await prisma.animal.create({
        data: {
          user_id,
          ...animal,
        },
      });
    }

    for (const plant of Plants) {
      const user_id = usersId[0];
      await prisma.plant.create({
        data: {
          user_id,
          ...plant,
        },
      });
    }

    for (const [index, absence] of Absences.entries()) {
      const user_id: string = usersId[index];
      await prisma.absence.create({
        data: {
          ...absence,
          user_id,
        },
      });
    }
    // }
  } catch (err) {
    console.error(err);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => await prisma.$disconnect());
