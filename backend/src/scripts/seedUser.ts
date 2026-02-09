import prisma from '../config/db';
import { createUser } from '../repositories/userRepository';

async function main() {
  const email = process.env.SEED_EMAIL || 'user@example.com';
  const password = process.env.SEED_PASSWORD || 'password123';

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log(`User with email ${email} already exists`);
      return;
    }

    const user = await createUser({ email, password });
    console.log(`Created user: ${user.email} (ID: ${user.id})`);
  } catch (error) {
    console.error('Error seeding user:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main();
