import { AnimalType } from 'src/animal/types/Animal.type.dto';
import { PlantType } from 'src/plant/types';
import { PhotoDto } from './../../photo/dto/Photo.dto';
export class HouseType {
  address: string;
  city: string;
  country_id: string;
  type_id: string;
  zipcode: string;
  title: string;
  rooms?: number;
  bedrooms?: number;
  surface?: number;
  area?: number;
  floor?: number;
  description?: string;
  latitude: string;
  longitude: string;
  map: string;
  internet?: boolean;
  washing_machine?: boolean;
  TV?: boolean;
  hoven?: boolean;
  microwave?: boolean;
  dishwasher?: boolean;
  bathtub?: boolean;
  shower?: boolean;
  parking?: boolean;
  user_id: string;
  photo?: PhotoDto[];
  animals?: AnimalType[];
  plants?: PlantType[];
}
