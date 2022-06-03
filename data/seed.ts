import { PrismaClient } from '@prisma/client';
import * as argon from 'argon2';
import { SignInDto } from '../src/auth/dto/';
import { CreateHouseDto } from '../src/house/dto/';
import { Countries, Types, Users, Houses } from '.';

const prisma = new PrismaClient();

Users: SignInDto;
Houses: CreateHouseDto;

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
