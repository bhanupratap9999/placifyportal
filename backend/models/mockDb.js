// Mock In-Memory Database for Development
// This is a temporary solution when MongoDB is not available

const mockUsers = new Map();

const mockDb = {
    users: {
        findOne: async (query) => {
            // Simulate database lookup
            for (const user of mockUsers.values()) {
                if (query.$or) {
                    for (const condition of query.$or) {
                        if (condition.email && user.email === condition.email) return user;
                        if (condition.username && user.username === condition.username) return user;
                    }
                } else if (query.email && user.email === query.email) {
                    return user;
                } else if (query.username && user.username === query.username) {
                    return user;
                } else if (query._id && user._id === query._id) {
                    return user;
                }
            }
            return null;
        },
        create: async (userData) => {
            const id = Math.random().toString(36).substr(2, 9);
            const user = {
                _id: id,
                ...userData,
                createdAt: new Date(),
                toPublicJSON: function() {
                    const {password, ...publicData} = this;
                    return publicData;
                }
            };
            mockUsers.set(id, user);
            console.log(`✅ Mock User created: ${userData.username}`);
            return user;
        }
    },
    clear: () => {
        mockUsers.clear();
        console.log('🧹 Mock database cleared');
    }
};

module.exports = mockDb;
