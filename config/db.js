const mongoose = require('mongoose');

const connectDB = async () => {
  let MONGO_URL = '';
  const { NODE_ENV, MONGO_TEST, MONGO_LOCAL, MONGO_URI } = process.env;

  switch (NODE_ENV) {
    case 'test':
      MONGO_URL = MONGO_TEST;
      break;
    case 'development':
      MONGO_URL = MONGO_LOCAL;
      break;
    default:
      MONGO_URL = MONGO_URI;
  }
  let connection;
  try {
    connection = await mongoose.connect(MONGO_URL, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true
    });

    console.log(
      `MongoDB Connected: ${connection.connection.host} in ${NODE_ENV} mode`
        .cyan.underline.bold
    );
  } catch (error) {
    console.log('Failed to connect to DB', error);
  }
};

const closeDB = () => {
  return mongoose.disconnect();
};

module.exports = { connectDB, closeDB };
