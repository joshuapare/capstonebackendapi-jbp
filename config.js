module.exports = {
    // 1. MongoDB
    MONGO_URI: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/jbp-musicapp',
  
    // 2. JWT
    TOKEN_SECRET: process.env.TOKEN_SECRET,
  
    // 3. Express Server Port
    LISTEN_PORT: process.env.LISTEN_PORT || 3000,

    ENV: process.env.ENV || 'development',

    JWT_DURATION: process.env.JWT_DURATION || '2 hours',

    REGION: process.env.REGION || 'us-east-1',

    

};