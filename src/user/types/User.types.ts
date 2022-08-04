import { AnimalType } from './../../animal/types/';
import { HouseType } from 'src/house/types';
import { PlantType } from 'src/plant/types';

export class UserType {
  email?: string;

  password?: string;

  firstname?: string;

  lastname?: string;

  pseudo?: string;

  phone_number?: string;

  avatar?: string;

  description?: string;

  isAdmin?: boolean;

  refresh_token?: string;

  house?: HouseType;

  animals?: AnimalType[];

  plants?: PlantType[];

  constructor(partial: Partial<UserType>) {
    Object.assign(this, partial);
  }
}
