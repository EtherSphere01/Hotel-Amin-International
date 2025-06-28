import { DataSource } from 'typeorm';
import { Accommodation } from './accommodation.entity';

export const accommodationSeedData = [
  {
    category: 'Family Suites Room',
    title: 'Family Suites Room',
    description:
      'Spacious family room perfect for up to 4 adults with modern amenities and comfortable bedding.',
    price: 1800,
    max_adults: 'Max 4 Adults',
    specs: ['Max 4 Adults', '2 Large Beds', 'AC & Geyser', 'Spacious Interior'],
    images: [
      'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400&h=300&fit=crop',
    ],
  },
  {
    category: 'Deluxe Couple Room',
    title: 'Deluxe Couple Room',
    description:
      'Elegant couple room designed for comfort and romance with premium amenities.',
    price: 2200,
    max_adults: 'Max 2 Adults + 1 Child',
    specs: [
      'Max 2 Adults + 1 Child',
      'Bed Size (6 X 7 Feet)',
      'AC & Geyser',
      'Well Interior',
    ],
    images: [
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1560448204-61ef5bd7929c?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1590490359683-658d3d23f972?w=400&h=300&fit=crop',
    ],
  },
  {
    category: 'Premium Couple',
    title: 'Premium Couple',
    description:
      'Luxurious premium room with top-tier amenities for an unforgettable stay.',
    price: 2800,
    max_adults: 'Max 2 Adults',
    specs: [
      'Max 2 Adults',
      'Luxury Queen Bed',
      'AC & Smart TV',
      'Modern Interior',
    ],
    images: [
      'https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1540518614846-7eded8853c8f?w=400&h=300&fit=crop',
    ],
  },
  {
    category: 'Executive Suite',
    title: 'Executive Suite',
    description:
      'Premium executive suite with exceptional comfort and luxury amenities for business and leisure travelers.',
    price: 3500,
    max_adults: 'Max 3 Adults + 2 Children',
    specs: [
      'Max 3 Adults + 2 Children',
      'King Size Bed',
      'Premium A/C',
      'High Speed Wifi',
    ],
    images: [
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1590490360180-f823b1c42e5a?w=400&h=300&fit=crop',
    ],
  },
];

export async function seedAccommodations(dataSource: DataSource) {
  const accommodationRepository = dataSource.getRepository(Accommodation);

  // Check if data already exists
  const existingAccommodations = await accommodationRepository.find();
  if (existingAccommodations.length > 0) {
    console.log('Accommodation data already exists, skipping seed...');
    return;
  }

  // Insert seed data
  const accommodations = accommodationRepository.create(accommodationSeedData);
  await accommodationRepository.save(accommodations);
  console.log('Accommodation seed data inserted successfully!');
}
