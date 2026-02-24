import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Password ko hash karna zaroori hai
  const hashedPassword = await bcrypt.hash('admin', 10) // Hashing the plain text password

  const admin = await prisma.user.upsert({
    where: { email: 'admin@admin.com' },
    update: {
      password: hashedPassword
    },
    create: {
      email: 'admin@admin.com',
      password: hashedPassword,
      role: 'ADMIN',
      balance: 1000000,
    },
  })

  // Initialize System Settings
  await prisma.systemSetting.upsert({
    where: { id: 'global' },
    update: {},
    create: {
      id: 'global',
      adminWalletAddress: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
      maintenanceMode: false,
    },
  })

  console.log('✅ Admin and System Settings Seeded Successfully')
}

main()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
