const mongoose = require("mongoose");

const connectDB = async () => {
   try {
      // URL encode the password to handle special characters
      const mongoUri =
         process.env.MONGODB_URI ||
         "mongodb+srv://barslanforbusiness:159357456bB%21@actahackathoncluster.nlm1pz5.mongodb.net/acta-barslan-product?retryWrites=true&w=majority&appName=ActaHackathonCluster";

      const conn = await mongoose.connect(mongoUri, {
         useNewUrlParser: true,
         useUnifiedTopology: true,
      });

      console.log(`MongoDB Connected: ${conn.connection.host}`);
      console.log(`Database: ${conn.connection.name}`);
   } catch (error) {
      console.error("Database connection error:", error.message);
      console.error("Full error:", error);
      process.exit(1);
   }
};

module.exports = connectDB;
