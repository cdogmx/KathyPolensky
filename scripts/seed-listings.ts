import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Sample listings with Watertown, WI area coordinates
const sampleListings = [
  {
    mlsNumber: '1929100',
    address: '305 Theresa St, Watertown, WI 53094',
    price: 324900,
    status: 'Active' as const,
    description: 'Beautiful 3BR/2BA home with updated kitchen and hardwood floors',
    latitude: 43.1945,
    longitude: -88.7289
  },
  {
    mlsNumber: '1934327',
    address: '228 Fremont St, Watertown, WI 53098',
    price: 279900,
    status: 'Active' as const,
    description: 'Charming 2BR/2BA cottage with fenced yard and deck',
    latitude: 43.2012,
    longitude: -88.7156
  },
  {
    mlsNumber: '1941234',
    address: '1425 N 4th St, Watertown, WI 53094',
    price: 425000,
    status: 'Pending' as const,
    description: 'Spacious 4BR/3BA colonial with 2-car garage and finished basement',
    latitude: 43.1898,
    longitude: -88.7423
  },
  {
    mlsNumber: '1956789',
    address: '567 E Main St, Watertown, WI 53094',
    price: 198500,
    status: 'Sold' as const,
    description: 'Cozy 2BR/1BA starter home with updated electrical',
    latitude: 43.1967,
    longitude: -88.7201
  },
  {
    mlsNumber: '1965432',
    address: '890 S 2nd St, Watertown, WI 53098',
    price: 365000,
    status: 'Active' as const,
    description: 'Modern 3BR/2.5BA townhouse with attached garage',
    latitude: 43.1823,
    longitude: -88.7356
  },
  {
    mlsNumber: '1978901',
    address: '1234 W Cady St, Watertown, WI 53094',
    price: 289900,
    status: 'Active' as const,
    description: 'Well-maintained 3BR/2BA ranch with large lot',
    latitude: 43.2056,
    longitude: -88.7123
  },
  {
    mlsNumber: '1987654',
    address: '456 N 8th St, Watertown, WI 53098',
    price: 512000,
    status: 'Pending' as const,
    description: 'Luxury 4BR/3.5BA home with pool and 3-car garage',
    latitude: 43.1778,
    longitude: -88.7489
  },
  {
    mlsNumber: '1990123',
    address: '789 E Oak St, Watertown, WI 53094',
    price: 245000,
    status: 'Active' as const,
    description: 'Updated 2BR/1.5BA bungalow with new roof and windows',
    latitude: 43.1912,
    longitude: -88.7245
  },
  {
    mlsNumber: '2003456',
    address: '321 S 6th St, Watertown, WI 53098',
    price: 398000,
    status: 'Sold' as const,
    description: 'Stunning 3BR/2BA contemporary with vaulted ceilings',
    latitude: 43.1867,
    longitude: -88.7312
  },
  {
    mlsNumber: '2016789',
    address: '654 W Johnson St, Watertown, WI 53094',
    price: 275000,
    status: 'Active' as const,
    description: 'Cute 2BR/2BA home with updated kitchen and bath',
    latitude: 43.2034,
    longitude: -88.7198
  }
];

async function seedListings() {
  try {
    console.log('🌱 Starting to seed listings...');

    // Clear existing listings
    await prisma.listing.deleteMany({});
    console.log('🗑️  Cleared existing listings');

    // Insert sample listings
    for (const listing of sampleListings) {
      await prisma.listing.create({
        data: listing
      });
    }

    console.log(`✅ Successfully seeded ${sampleListings.length} listings`);
    
    // Verify the data
    const count = await prisma.listing.count();
    console.log(`📊 Total listings in database: ${count}`);

  } catch (error) {
    console.error('❌ Error seeding listings:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seeder
if (require.main === module) {
  seedListings()
    .then(() => {
      console.log('🎉 Seeding completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Seeding failed:', error);
      process.exit(1);
    });
}

export default seedListings;
