// Script to seed sample users in the mock database
const mockDb = require('./models/mockDb');

const seedUsers = async () => {
    try {
        console.log('Seeding mock database with test users...');
        
        const testUsers = [
            {
                username: 'bhanu',
                email: 'bhanupratap@gmail.com',
                password: 'bhanu@98765',
                userType: 'student',
                profile: {
                    fullName: 'bhanu'
                }
            },
            {
                username: 'testcompany',
                email: 'company@test.com',
                password: 'password123',
                userType: 'company',
                profile: {
                    fullName: 'Test Company'
                }
            },
            {
                username: 'student123',
                email: 'student@example.com',
                password: 'student123',
                userType: 'student',
                profile: {
                    fullName: 'John Doe'
                }
            }
        ];

        for (const userData of testUsers) {
            const user = await mockDb.users.create(userData);
            console.log(`✅ Created test user: ${userData.username}`);
        }

        console.log('🎉 Seed completed successfully');
    } catch (error) {
        console.error('Error seeding users:', error);
    }
};

// Run if this file is executed directly
if (require.main === module) {
    seedUsers();
}

module.exports = seedUsers;
