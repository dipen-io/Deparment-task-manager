const validateEnv = () => {
    const requiredEnvVars = [
        'PORT',
        'MONGO_URI',
        'JWT_SECRET',
        'JWT_REFRESH_SECRET',
    ];

    // Find any variables that are missing or empty
    const missingVars = requiredEnvVars.filter((key) => !process.env[key]);

    if (missingVars.length > 0) {
        console.error(` FATAL STARTUP ERROR: Missing required environment variables:`);
        console.error(` ${missingVars.join(', ')}`);
        
        process.exit(1); 
    }
};

module.exports = validateEnv;
