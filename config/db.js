const mongoose = require("mongoose");

const connectToMongoDB = async () => {
  const dbConnection = await mongoose.connect(process.env.MONGODB_URI, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  console.log(
    `MongoDB Connected: ${dbConnection.connection.host}`.cyan.underline.inverse
  );
};

module.exports = connectToMongoDB;
