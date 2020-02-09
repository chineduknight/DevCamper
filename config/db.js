const mongoose = require('mongoose');

const connectDB = async () => {
  const MONGO_URL =
    process.env.NODE_ENV === 'development'
      ? process.env.MONGO_LOCAL
      : process.env.MONGO_URI;
  const connection = await mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  });

  console.log(
    `MongoDB Connected: ${connection.connection.host}`.cyan.underline.bold
  );
};

module.exports = connectDB;
