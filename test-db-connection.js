const { PrismaClient } = require('@prisma/client')


const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
})

async function testConnection() {
    try {
        console.log('Testing database connection...')

        // Try a simple query
        const count = await prisma.user.count()
        console.log('✅ Connection successful!')
        console.log(`Found ${count} users in the database`)

    } catch (error) {
        console.error('❌ Connection failed!')
        console.error('Error details:', error.message)

        if (error.message.includes('Server selection timeout')) {
            console.log('\n🔍 Troubleshooting tips:')
            console.log('1. Check your MongoDB Atlas Network Access settings')
            console.log('2. Verify your IP address is whitelisted (or use 0.0.0.0/0 for testing)')
            console.log('3. Ensure your DATABASE_URL in .env is correct')
            console.log('4. Verify your database user credentials are valid')
            console.log('5. Check if your MongoDB cluster is running')
        }
    } finally {
        await prisma.$disconnect()
    }
}

testConnection()
