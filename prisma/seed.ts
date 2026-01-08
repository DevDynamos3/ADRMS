
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

/**
 * Main function to seed the database with initial admin users.
 * It hashes passwords and uses prisma.user.upsert to ensure users exist
 * without creating duplicates if the script is run multiple times.
 */
async function main() {
  // Hash the default admin password
  const password = await bcrypt.hash('adrms.admin123', 10)

  // Upsert the primary admin user
  const upsertUser = await prisma.user.upsert({
    where: { email: 'admin@adrms.com' },
    update: {},
    create: {
      email: 'admin@adrms.com',
      name: 'Admin',
      role: 'admin',
      password,
    },
  })

  console.log({ upsertUser })

  // Hash a second admin password for a developer/specific admin account
  const newAdminPassword = await bcrypt.hash('adeyemi001', 10)

  // Upsert the second admin user or update their password/role if they already exist
  const newAdmin = await prisma.user.upsert({
    where: { email: 'adeyemicodes@gmail.com' },
    update: {
      password: newAdminPassword,
      role: 'super_admin',
    },
    create: {
      email: 'adeyemicodes@gmail.com',
      name: 'Adeyemi Admin',
      role: 'super_admin',
      password: newAdminPassword,
    },
  })
  console.log({ newAdmin })
}

/**
 * Execute the main function and handle the database connection lifecycle.
 * Disconnects from the database after completion or on error.
 */
main()
  .then(async () => {
    // Successfully finished seeding, disconnect from the database
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    // Log any errors that occurred during seeding
    console.error(e)
    // Ensure database disconnection even on failure
    await prisma.$disconnect()
    process.exit(1)
  })
