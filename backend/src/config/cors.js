const whitelist = ['http://localhost:5174', 'http://localhost:5173'];

const corsOptions = {
    origin: function (origin, callback) {
        // !origin allows server-to-server or tools like Postman
        if (!origin || whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true, 
};

module.exports = corsOptions;
