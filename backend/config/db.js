import mongoose from "mongoose";
import colors from "colors";

const defaultMongoUri = "mongodb://127.0.0.1:27017/mern-ecommerce";

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || defaultMongoUri;
    const conn = await mongoose.connect(mongoUri, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
    });

    if (!process.env.MONGO_URI) {
      console.log(
        `MONGO_URI not set. Using local MongoDB at ${defaultMongoUri}`.yellow
      );
    }

    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
  } catch (error) {
    console.error(`Error: ${error.message}`.red.underline.bold);
    process.exit(1);
  }
};

export default connectDB;
