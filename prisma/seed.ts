import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Password ko hash karna zaroori hai
  const hashedPassword = await bcrypt.hash('Admin@112', 10) // Hashing the plain text password

  const admin = await prisma.user.upsert({
    where: { email: 'admin@exotic-cash.com' },
    update: {
      password: hashedPassword // Agar account hai to password update ho jaye
    },
    create: {
      email: 'admin@exotic-cash.com',
      password: hashedPassword,
      role: 'ADMIN',
      balance: 5000,
    },
  })

  console.log('✅ Admin Seeded Successfully with Hashed Password')
}

main()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
