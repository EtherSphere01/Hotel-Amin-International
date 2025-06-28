import { DataSource } from 'typeorm';
import { Rooms, RoomStatus, HousekeepingStatus } from './entities/room.entity';

export const roomSeedData = [
  // Family Suites Room
  {
    room_num: 101,
    floor: 1,
    capacity: 4,
    type: 'Family Suites Room',
    description: 'Spacious family room on the first floor',
    room_price: 1800,
    discount: 0,
    room_status: RoomStatus.AVAILABLE,
    housekeeping_status: HousekeepingStatus.CLEAN,
  },
  {
    room_num: 102,
    floor: 1,
    capacity: 4,
    type: 'Family Suites Room',
    description: 'Spacious family room on the first floor',
    room_price: 1800,
    discount: 0,
    room_status: RoomStatus.AVAILABLE,
    housekeeping_status: HousekeepingStatus.CLEAN,
  },
  {
    room_num: 103,
    floor: 1,
    capacity: 4,
    type: 'Family Suites Room',
    description: 'Spacious family room on the first floor',
    room_price: 1800,
    discount: 0,
    room_status: RoomStatus.AVAILABLE,
    housekeeping_status: HousekeepingStatus.CLEAN,
  },

  // Deluxe Couple Room
  {
    room_num: 201,
    floor: 2,
    capacity: 3,
    type: 'Deluxe Couple Room',
    description: 'Elegant couple room on the second floor',
    room_price: 2200,
    discount: 0,
    room_status: RoomStatus.AVAILABLE,
    housekeeping_status: HousekeepingStatus.CLEAN,
  },
  {
    room_num: 202,
    floor: 2,
    capacity: 3,
    type: 'Deluxe Couple Room',
    description: 'Elegant couple room on the second floor',
    room_price: 2200,
    discount: 0,
    room_status: RoomStatus.AVAILABLE,
    housekeeping_status: HousekeepingStatus.CLEAN,
  },
  {
    room_num: 203,
    floor: 2,
    capacity: 3,
    type: 'Deluxe Couple Room',
    description: 'Elegant couple room on the second floor',
    room_price: 2200,
    discount: 0,
    room_status: RoomStatus.AVAILABLE,
    housekeeping_status: HousekeepingStatus.CLEAN,
  },

  // Premium Couple
  {
    room_num: 301,
    floor: 3,
    capacity: 2,
    type: 'Premium Couple',
    description: 'Luxurious premium room on the third floor',
    room_price: 2800,
    discount: 0,
    room_status: RoomStatus.AVAILABLE,
    housekeeping_status: HousekeepingStatus.CLEAN,
  },
  {
    room_num: 302,
    floor: 3,
    capacity: 2,
    type: 'Premium Couple',
    description: 'Luxurious premium room on the third floor',
    room_price: 2800,
    discount: 0,
    room_status: RoomStatus.AVAILABLE,
    housekeeping_status: HousekeepingStatus.CLEAN,
  },

  // Executive Suite
  {
    room_num: 401,
    floor: 4,
    capacity: 5,
    type: 'Executive Suite',
    description: 'Premium executive suite on the fourth floor',
    room_price: 3500,
    discount: 0,
    room_status: RoomStatus.AVAILABLE,
    housekeeping_status: HousekeepingStatus.CLEAN,
  },
  {
    room_num: 402,
    floor: 4,
    capacity: 5,
    type: 'Executive Suite',
    description: 'Premium executive suite on the fourth floor',
    room_price: 3500,
    discount: 0,
    room_status: RoomStatus.AVAILABLE,
    housekeeping_status: HousekeepingStatus.CLEAN,
  },
];

export async function seedRooms(dataSource: DataSource) {
  const roomRepository = dataSource.getRepository(Rooms);

  // Check if data already exists
  const existingRooms = await roomRepository.find();
  if (existingRooms.length > 0) {
    console.log('Room data already exists, skipping seed...');
    return;
  }

  // Insert seed data
  const rooms = roomRepository.create(roomSeedData);
  await roomRepository.save(rooms);
  console.log('Room seed data inserted successfully!');
}
