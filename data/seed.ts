import { PrismaClient } from '@prisma/client';
import * as argon from 'argon2';
import { Countries, Types, Users, Houses, Photos, Animals, Plants } from '.';
import { SignInDto } from '../src/auth/dto/';
import { CreateHouseDto } from '../src/house/dto/';
import { CountryType } from '../src/country/types';
import { Type } from '../src/type/types';
import { PhotoDto } from '../src/photo/dto';
import { AnimalDto } from '../src/animal/dto';
import { PlantDto } from '../src/plant/dto';

const prisma = new PrismaClient();

Users: [SignInDto];
Houses: [CreateHouseDto];
Countries: [CountryType];
Types: [Type];
Photos: [PhotoDto];
Animals: [AnimalDto];
Plants: [PlantDto];

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

    const countriesId = await (
      await prisma.country.findMany()
    ).map((country) => country.id);
    const typesId = await (await prisma.type.findMany()).map((type) => type.id);
    const usersId = await (await prisma.user.findMany()).map((user) => user.id);

    for (const [index, house] of Houses.entries()) {
      const user_id: string = usersId[index];
      const country_id: string =
        countriesId[Math.floor(Math.random() * countriesId.length)];
      const type_id: string =
        typesId[Math.floor(Math.random() * typesId.length)];
      await prisma.house.create({
        data: {
          ...house,
          user_id,
          country_id,
          type_id,
        },
      });
    }

    const housesId = await (
      await prisma.house.findMany()
    ).map((house) => house.id);
    const house_id = housesId[0];

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
