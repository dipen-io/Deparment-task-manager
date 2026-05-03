// seeding
const bcrypt = require("bcrypt");
const User = require("../modules/user/user.model");

const makeAmin = async() => {
    try {

        // const adminExist = await User.findOne({role: 'Admin'});
        const adminEmail = "borod9200@gmail.com";
        const adminExist = await User.findOne({email: adminEmail});

        if (adminExist) {
            // console.log("Admin already exist");
            return;
        }

        const password = 'admin@123'

        await User.create({
            name: "Admin",
            email: adminEmail,
            password: password,
            role: 'Admin'
        });
        console.log('✅ Default Admin seeded successfully!');
    }
    catch (error) {
        console.error(`❌ Failed to seed admin: ${error.message}`);
        throw error;
    }

}

module.exports = makeAmin;
