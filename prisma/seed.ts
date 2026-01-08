
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const password = await bcrypt.hash('admin123', 10)
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

  const newAdminPassword = await bcrypt.hash('adeyemi001', 10)
  const newAdmin = await prisma.user.upsert({
    where: { email: 'adeyemicodes@gmail.com' },
    update: {
      password: newAdminPassword,
    },
    create: {
      email: 'adeyemicodes@gmail.com',
      name: 'Adeyemi Admin',
      role: 'admin',
      password: newAdminPassword,
    },
  })
  console.log({ newAdmin })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
