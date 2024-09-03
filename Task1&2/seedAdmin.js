// seedAdmin.js
const bcrypt = require('bcryptjs');
const sequelize = require('./config/db');
const User = require('./models/User');

async function createAdmin() {
    try {
        await sequelize.sync({ force: false }); // Ensure tables are created

        const existingAdmin = await User.findOne({ where: { email: 'admin@ecommerce.com' } });
        if (existingAdmin) {
            console.log('Admin user already exists.');
            process.exit();
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin', salt); // Use a secure password

        await User.create({
            name: 'Admin',
            email: 'admin@gmail.com',
            phone: '9148560449',
            password: hashedPassword,
            role: 'admin'
        });

        console.log('Admin user created successfully.');
        process.exit();
    } catch (err) {
        console.error('Error creating admin user:', err);
        process.exit(1);
    }
}

createAdmin();
