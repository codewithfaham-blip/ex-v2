import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Password ko hash karna zaroori hai
  const hashedPassword = await bcrypt.hash('admin', 10) // Hashing the plain text password

  const admin = await prisma.user.upsert({
    where: { email: 'admin@admin.com' },
    update: {
      password: hashedPassword // Agar account hai to password update ho jaye
    },
    create: {
      email: 'admin@admin.com',
      password: hashedPassword,
      role: 'ADMIN',
      balance: 1000000,
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
